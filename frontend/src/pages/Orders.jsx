import { useEffect, useState } from "react";
import { orderApi } from "../services/api";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await orderApi.getMyOrders();
      setOrders(res.data.orders || []);
    };

    fetchOrders();
  }, []);

  const toggleExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
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

          return (
            <div
              key={order._id}
              className="mb-4 rounded-lg bg-white border border-[#e6d9c8] shadow-sm"
            >
              {/* ===== Order summary ===== */}
              <div
                className="flex justify-between items-start p-4 cursor-pointer"
                onClick={() => toggleExpand(order._id)}
              >
                {/* Left: Order ID + date */}
                <div>
                  <p className="font-medium text-[#2f241c]">
                    Order #{shortOrderId}
                  </p>
                  <p className="text-xs text-gray-500">{orderDate}</p>
                </div>

                {/* Right: Total + payment status */}
                <div className="text-right">
                  <p className="font-semibold text-green-800">
                    ₹{order.totalAmount}
                  </p>
                  <p
                    className={`mt-1 text-xs font-semibold
                      ${
                        order.paymentStatus === "PAID"
                          ? "text-green-600"
                          : order.paymentStatus === "PENDING"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                  >
                    {order.paymentStatus}
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
                    <div>
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
                        {order.shippingAddress.addressLine2 && (
                          <> , {order.shippingAddress.addressLine2}</>
                        )}
                        <br />

                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state} –{" "}
                        {order.shippingAddress.pincode}
                      </p>
                    </div>
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
