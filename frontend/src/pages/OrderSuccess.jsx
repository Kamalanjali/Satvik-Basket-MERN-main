import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { orderApi } from "../services/api";

function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const orderId = location.state?.orderId;

  useEffect(() => {
    // If user lands here without an orderId, kick them out
    if (!orderId) {
      navigate("/", { replace: true });
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await orderApi.getById(orderId);
        setOrder(res.data.order);
      } catch (error) {
        console.error("Failed to fetch order", error);
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdf9f3]">
        <p className="text-[#2f241c]">Loading order details…</p>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdf9f3] text-center px-4">
      <h1 className="text-2xl md:text-3xl font-serif font-bold text-green-800 mb-4">
        Order Placed Successfully 🎉
      </h1>

      <p className="mb-2 text-[#2f241c]">
        Order ID: <strong>{order._id}</strong>
      </p>

      <p className="mb-6 text-[#2f241c]">
        Total Paid: <strong>₹{order.totalAmount}</strong>
      </p>

      <div className="mt-6 rounded bg-white p-4 shadow-sm text-left max-w-md">
        <h3 className="font-semibold mb-2">Delivered To</h3>
        <p>{order.shippingAddress.fullName}</p>
        <p>{order.shippingAddress.addressLine1}</p>
        <p>
          {order.shippingAddress.city}, {order.shippingAddress.state} –{" "}
          {order.shippingAddress.pincode}
        </p>
        <p>Phone: {order.shippingAddress.phone}</p>
      </div>
      <br />
      <br />
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
