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
 * Open Razorpay Checkout (AUTHENTICATED)
 */
export const openRazorpayCheckout = async ({ orderId, onSuccess, onClose, onFailure, }) => {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    toast.error("Failed to load payment gateway. Please refresh.");
    return;
  }

  try {
    // 1️⃣ Create Razorpay order (backend)
    const { data } = await api.post("/payments/razorpay/create", { orderId });
    const { razorpayOrder, paymentId } = data;

    // 2️⃣ Configure checkout options
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: razorpayOrder.amount,
      currency: "INR",
      name: "Satvik Basket",
      description: "Order Payment",
      order_id: razorpayOrder.id,

      handler: async (response) => {
        try {
          // 3️⃣ Verify payment (backend)
          await api.post("/payments/razorpay/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            paymentId,
          });

          toast.success("Payment successful 🎉");
          onSuccess?.();
        } catch (err) {
          console.error("Payment verification failed", err);
          toast.error("Payment verification failed. Please retry.");
          onfalure?.();
        }
      },

      modal: {
        ondismiss: () => {
          toast("Payment cancelled. You can retry from Orders.", {
            icon: "⚠️",
          });
          onClose?.();
        },
      },

      theme: { color: "#4CAF50" },
    };

    // 4️⃣ Open checkout + handle failure event
    const razorpay = new window.Razorpay(options);

    razorpay.on("payment.failed", () => {
      toast.error("Payment failed. You can retry from Orders page.");
      onFailure?.();
    });

    razorpay.open();
  } catch (error) {
    console.error("Razorpay checkout error:", error);
    toast.error("Payment initiation failed. Please try again.");
    onFailure?.();
  }
};
