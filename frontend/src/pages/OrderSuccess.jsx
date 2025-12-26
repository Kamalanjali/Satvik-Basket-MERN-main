import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!location.state) {
      navigate("/", { replace: true });
    }
  }, [location.state, navigate]);

  if (!location.state) return null; // prevent flicker

  const { orderId, totalAmount } = location.state;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdf9f3] text-center px-4">
      <h1 className="text-2xl md:text-3xl font-serif font-bold text-green-800 mb-4">
        Order Placed Successfully 🎉
      </h1>

      <p className="mb-2 text-[#2f241c]">
        Order ID: <strong>{orderId}</strong>
      </p>

      <p className="mb-6 text-[#2f241c]">
        Total Paid: <strong>₹{totalAmount}</strong>
      </p>

      <button
        onClick={() => navigate("/orders")}
        className="rounded bg-green-700 px-6 py-3 text-white hover:bg-green-800"
      >
        View My Orders
      </button>
    </div>
  );
}

export default OrderSuccess;
