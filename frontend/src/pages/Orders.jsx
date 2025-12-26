import { useEffect, useState } from "react";
import { orderApi } from "../services/api";
import { openRazorpayCheckout } from "../utils/razorpayCheckout";

/* ================= Status UI Mapping ================= */
const paymentStatusUI = {
  PAID: {
    label: "Payment Successful",
    color: "text-green-600",
  },
  PENDING: {
    label: "Awaiting Payment",
    color: "text-yellow-600",
  },
  FAILED: {
    label: "Payment Failed",
    color: "text-red-600",
  },
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [payingOrderId, setPayingOrderId] = useState(null);

  const fetchOrders = async () => {
    const res = await orderApi.getMyOrders();
    setOrders(res.data.orders || []);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handlePayNow = async (orderId) => {
    try {
      setPayingOrderId(orderId);

      await openRazorpayCheckout({
        orderId,
        onSuccess: async () => {
          await fetchOrders();
          setPayingOrderId(null);
        },
        onClose: () => {
          setPayingOrderId(null);
        },

        onFailure: () => {
          setPayingOrderId(null);
        },
      });
    } catch (err) {
      console.error("Payment retry failed", err);
      setPayingOrderId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf9f3] px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-2xl font-serif font-bold text-[#2f241c]">
          My Orders
        </h1>

        {orders.map((order) => {
          const shortOrderId = order._id.slice(-6).toUpperCase();
          const orderDate = new Date(order.createdAt).toLocaleString();
          const isPending = order.paymentStatus === "PENDING";
          const statusMeta = paymentStatusUI[order.paymentStatus];

          return (
            <div
              key={order._id}
              className={`mb-4 rounded-lg bg-white border border-[#e6d9c8] shadow-sm
                ${
                  payingOrderId === order._id
                    ? "opacity-70 pointer-events-none"
                    : ""
                }
                `}
            >
              {/* ===== Order summary ===== */}
              <div
                className="flex justify-between items-start p-4 cursor-pointer"
                onClick={() => {
                  if (!payingOrderId) toggleExpand(order._id);
                }}
              >
                {/* Left */}
                <div>
                  <p className="font-medium text-[#2f241c]">
                    Order #{shortOrderId}
                  </p>
                  <p className="text-xs text-gray-500">{orderDate}</p>
                </div>

                {/* Right */}
                <div className="text-right">
                  <p className="font-semibold text-green-800">
                    ₹{order.totalAmount}
                  </p>
                  <p
                    className={`mt-1 text-xs font-semibold ${statusMeta?.color}`}
                  >
                    {statusMeta?.label || order.paymentStatus}
                  </p>
                </div>
              </div>

              {/* ===== Expanded details ===== */}
              {expandedOrderId === order._id && (
                <div className="border-t px-4 py-3 text-sm">
                  {/* Items */}
                  <div className="mb-4">
                    <p className="font-semibold mb-1">Items</p>
                    {order.orderItems?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between text-gray-700"
                      >
                        <span>
                          {item.name || "Item"} × {item.quantity}
                        </span>
                        {item.price && (
                          <span>₹{item.price * item.quantity}</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Delivery Address */}
                  {order.shippingAddress && (
                    <div className="mb-4">
                      <p className="font-semibold mb-1">Delivery Address</p>
                      <p className="text-gray-600 leading-relaxed">
                        <span className="font-medium text-[#2f241c]">
                          {order.shippingAddress.fullName}
                        </span>
                        <br />
                        {order.shippingAddress.email && (
                          <>
                            {order.shippingAddress.email}
                            <br />
                          </>
                        )}
                        {order.shippingAddress.phone}
                        <br />
                        {order.shippingAddress.addressLine1}
                        <br />
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state} –{" "}
                        {order.shippingAddress.pincode}
                      </p>
                    </div>
                  )}

                  {/* ===== Pay Now (only if pending) ===== */}
                  {isPending && (
                    <button
                      onClick={() => handlePayNow(order._id)}
                      disabled={payingOrderId === order._id}
                      className={`mt-2 rounded px-4 py-2 text-sm font-semibold
                        ${
                          payingOrderId === order._id
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-green-700 text-white hover:bg-green-800"
                        }`}
                    >
                      {payingOrderId === order._id
                        ? "Processing..."
                        : "Pay Now"}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Orders;
