import { api } from "../services/api";
import toast from "react-hot-toast";

/**
 * Load Razorpay SDK
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

/**
 * Open Razorpay Checkout (Safe + Idempotent)
 */
export const openRazorpayCheckout = async ({
  orderId,
  onSuccess,
  onFailure,
}) => {
  let finalized = false;

  const failSafely = (message) => {
    if (finalized) return;
    finalized = true;
    toast.error(message);
    onFailure?.();
  };

  const loaded = await loadRazorpayScript();
  if (!loaded) {
    failSafely("Unable to load payment system");
    return;
  }

  try {
    // 🔐 Backend creates Razorpay order
    const { data } = await api.post("/payments/razorpay/create", { orderId });

    const { razorpayOrder, paymentId } = data;

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: razorpayOrder.amount,
      currency: "INR",
      name: "Satvik Basket",
      description: "Order Payment",
      order_id: razorpayOrder.id,

      handler: async (response) => {
        try {
          await api.post("/payments/razorpay/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            paymentId,
          });

          if (finalized) return;
          finalized = true;

          toast.success("Payment successful 🎉 Order confirmed");
          onSuccess?.();
        } catch {
          failSafely(
            "Payment received but verification failed. Support will contact you."
          );
        }
      },

      modal: {
        ondismiss: () => {
          failSafely("Payment cancelled. You can retry anytime.");
        },
      },

      theme: { color: "#4CAF50" },
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", () => {
      failSafely("Payment failed. Please try again.");
    });

    rzp.open();
  } catch (error) {
    console.error("Razorpay error:", error);
    failSafely("Unable to initiate payment");
  }
};