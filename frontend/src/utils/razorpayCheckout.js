import { api } from "../services/api";
import toast from "react-hot-toast";

/**
 * Load Razorpay SDK safely (once)
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

/**
 * Open Razorpay Checkout
 * Fully guarded against:
 * - multiple popups
 * - double success
 * - cancel → success bug
 */
export const openRazorpayCheckout = async ({
  orderId,
  onSuccess,
  onFailure,
}) => {
  let finalized = false;

  const finishFailure = (message) => {
    if (finalized) return;
    finalized = true;
    toast.error(message);
    onFailure?.();
  };

  const finishSuccess = () => {
    if (finalized) return;
    finalized = true;
    toast.success("Payment successful 🎉 Order confirmed");
    onSuccess?.();
  };

  const loaded = await loadRazorpayScript();
  if (!loaded) {
    finishFailure("Unable to load payment gateway");
    return;
  }

  try {
    // 1️⃣ Ask backend to create Razorpay order
    const { data } = await api.post("/payments/razorpay/create", { orderId });

    const { razorpayOrder, paymentId } = data;

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: razorpayOrder.amount,
      currency: "INR",
      name: "Satvik Basket",
      description: "Secure Order Payment",
      order_id: razorpayOrder.id,

      /**
       * 2️⃣ Called ONLY when Razorpay thinks payment succeeded
       * Still NOT trusted → backend verification mandatory
       */
      handler: async (response) => {
        try {
          await api.post("/payments/razorpay/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            paymentId,
          });

          finishSuccess();
        } catch (err) {
          console.error("Verification failed:", err);

          toast(
            "Payment received, but verification pending. Please check Orders.",
            { icon: "⏳" }
          );

          finishFailure("");
        }
      },

      /**
       * 3️⃣ User closes Razorpay modal
       */
      modal: {
        ondismiss: () => {
          finishFailure("Payment cancelled. You can retry anytime.");
        },
      },

      theme: {
        color: "#4CAF50",
      },
    };

    const rzp = new window.Razorpay(options);

    /**
     * 4️⃣ Explicit Razorpay failure event
     */
    rzp.on("payment.failed", () => {
      finishFailure("Payment failed. Please try again.");
    });

    rzp.open();
  } catch (error) {
    console.error("Payment init error:", error);
    finishFailure("Unable to initiate payment");
  }
};
