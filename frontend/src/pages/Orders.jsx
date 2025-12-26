import { useEffect, useState } from "react";
import { orderApi } from "../services/api";
import OrderCard from "../components/OrderCard";

function Orders() {
  const [orders, setOrders] = useState([]); // always array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await orderApi.getMyOrders();

      console.log("📦 ORDERS API RAW RESPONSE:", response.data);

      // ✅ FIX: backend returns { success, orders }
      setOrders(response.data.orders || []);
    } catch (err) {
      console.error("❌ Failed to fetch orders:", err);
      setError("Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  fetchOrders();
}, []);


  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdf9f3]">
        <p className="text-[#6b4f3f]">Loading your orders…</p>
      </div>
    );
  }

  /* ---------------- ERROR ---------------- */
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdf9f3]">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  /* ---------------- EMPTY STATE ---------------- */
  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdf9f3] text-center">
        <p className="mb-3 text-lg text-[#6b4f3f]">
          You haven’t placed any orders yet.
        </p>
        <p className="text-sm text-[#8b6f55]">
          Once you place an order, it will appear here.
        </p>
      </div>
    );
  }

  /* ---------------- ORDERS LIST ---------------- */
  return (
    <div className="min-h-screen bg-[#fdf9f3]">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h1 className="mb-8 text-3xl font-serif font-bold text-[#2f241c]">
          My Orders
        </h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Orders;
