import { useLocation, useNavigate } from "react-router-dom";

function OrderSuccess() {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state?.orderId) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#fdf9f3] flex items-center justify-center">
      <div className="max-w-lg rounded-lg bg-white p-10 text-center shadow">
        <h1 className="mb-4 text-3xl font-serif font-bold text-green-700">
          Order Placed Successfully 🎉
        </h1>

        <p className="mb-2 text-[#6b4f3f]">
          Thank you for shopping with Satvik Basket.
        </p>

        <p className="mb-6 text-sm text-[#8b6f55]">
          Order ID: <span className="font-medium">{state.orderId}</span>
        </p>

        <p className="mb-8 text-xl font-bold text-[#2f241c]">
          Total: ₹{state.totalAmount}
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate("/orders")}
            className="rounded bg-green-700 py-3 text-white hover:bg-green-800 transition"
          >
            View My Orders
          </button>

          <button
            onClick={() => navigate("/")}
            className="rounded border py-3 text-[#2f241c] hover:bg-[#f5efe6] transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;
