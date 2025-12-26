import { useState } from "react";

function OrderCard({ order }) {
  const [open, setOpen] = useState(false);

  const statusStyles = {
    PAID: "bg-green-100 text-green-700",
    PENDING: "bg-yellow-100 text-yellow-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  const statusClass =
    statusStyles[order.status] || "bg-gray-100 text-gray-700";

  return (
    <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
      {/* -------- HEADER -------- */}
      <div
        className="flex cursor-pointer items-start justify-between p-5 hover:bg-[#f9f5ef]"
        onClick={() => setOpen(!open)}
      >
        <div>
          <p className="text-xs text-[#8b6f55]">Order ID</p>
          <p className="font-mono text-sm text-[#2f241c] break-all">
            {order._id}
          </p>
          <p className="mt-1 text-xs text-[#6b4f3f]">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="text-right">
          <p className="text-lg font-semibold text-green-800">
            ₹{order.totalAmount}
          </p>
          <span
            className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${statusClass}`}
          >
            {order.status}
          </span>
        </div>
      </div>

      {/* -------- EXPANDED DETAILS -------- */}
      {open && (
        <div className="border-t bg-[#fdf9f3] p-5 text-sm space-y-5">
          {/* ITEMS */}
          <div>
            <h4 className="mb-3 font-semibold text-[#2f241c]">Items</h4>
            <div className="space-y-2">
              {order.items.map((item) => {
                const name =
                  item.name || item.productId?.name || "Product";
                const price =
                  item.price || item.productId?.price || 0;

                return (
                  <div
                    key={item._id}
                    className="flex justify-between text-[#6b4f3f]"
                  >
                    <span>
                      {name} × {item.quantity}
                    </span>
                    <span>₹{price * item.quantity}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ADDRESS */}
          {order.address && (
            <div>
              <h4 className="mb-2 font-semibold text-[#2f241c]">
                Delivery Address
              </h4>
              <p>{order.address.name}</p>
              <p className="text-[#6b4f3f]">{order.address.phone}</p>
              <p className="text-[#6b4f3f]">
                {order.address.street}
              </p>
              <p className="text-[#6b4f3f]">
                {order.address.city}, {order.address.state} –{" "}
                {order.address.pincode}
              </p>
              {order.address.email && (
                <p className="text-[#6b4f3f]">{order.address.email}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default OrderCard;
