import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { orderApi } from "../services/api";

function Checkout({ cartItems, setCartItems }) {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const isFormValid =
    address.name &&
    address.phone &&
    address.street &&
    address.city &&
    address.state &&
    address.pincode;

  // Empty cart view
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#fdf9f3] flex flex-col items-center justify-center">
        <h2 className="mb-4 text-2xl font-serif font-bold text-[#2f241c]">
          Your cart is empty
        </h2>
        <Link
          to="/"
          className="rounded bg-green-700 px-6 py-3 text-white hover:bg-green-800 transition"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  // Place order handler
  const handlePlaceOrder = async () => {
    try {
      setSubmitting(true);

      const response = await orderApi.create({
        items: cartItems.map((item) => ({
          productId: item._id || item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount,
        address,
      });

      //save address locally ( for reuse)
      localStorage.setItem("savedAddress", JSON.stringify(address));

      // Clear cart
      setCartItems([]);

      // Navigate to order success page
      navigate("/order-success", {
        state: {
          orderId: response.data.order._id,
          totalAmount,
        },
      });
    } catch (error) {
      console.error("Order creation failed:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf9f3]">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h1 className="mb-10 text-3xl font-serif font-bold text-[#2f241c]">
          Checkout
        </h1>

        {/* Cart Summary */}
        <div className="mb-10 rounded-lg bg-white p-6 shadow">
          {cartItems.map((item) => (
            <div
              key={item._id || item.id}
              className="flex items-center justify-between border-b py-4 last:border-b-0"
            >
              <div>
                <h3 className="font-medium text-[#2f241c]">{item.name}</h3>
                <p className="text-sm text-[#6b4f3f]">
                  Quantity: {item.quantity}
                </p>
              </div>

              <span className="font-semibold text-green-800">
                ₹{item.price * item.quantity}
              </span>
            </div>
          ))}
        </div>

        {/* Address Form */}
        <div className="mb-10 rounded-lg bg-white p-6 shadow">
          <h2 className="mb-6 text-xl font-serif font-semibold text-[#2f241c]">
            Delivery Address
          </h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <input
              type="text"
              placeholder="Full Name"
              value={address.name}
              onChange={(e) => setAddress({ ...address, name: e.target.value })}
              className="rounded border px-4 py-3"
            />

            <input
              type="tel"
              placeholder="Phone Number"
              value={address.phone}
              onChange={(e) =>
                setAddress({ ...address, phone: e.target.value })
              }
              className="rounded border px-4 py-3"
            />

            <input
              type="text"
              placeholder="Street Address"
              value={address.street}
              onChange={(e) =>
                setAddress({ ...address, street: e.target.value })
              }
              className="rounded border px-4 py-3 md:col-span-2"
            />

            <input
              type="text"
              placeholder="City"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              className="rounded border px-4 py-3"
            />

            <input
              type="text"
              placeholder="State"
              value={address.state}
              onChange={(e) =>
                setAddress({ ...address, state: e.target.value })
              }
              className="rounded border px-4 py-3"
            />

            <input
              type="text"
              placeholder="Pincode"
              value={address.pincode}
              onChange={(e) =>
                setAddress({ ...address, pincode: e.target.value })
              }
              className="rounded border px-4 py-3"
            />
          </div>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between rounded-lg bg-[#f5efe6] p-6">
          <span className="text-lg font-semibold text-[#2f241c]">
            Total Amount
          </span>
          <span className="text-2xl font-bold text-green-800">
            ₹{totalAmount}
          </span>
        </div>

        {/* Place Order */}
        <button
          disabled={!isFormValid || submitting}
          onClick={handlePlaceOrder}
          className={`mt-8 w-full rounded py-4 text-lg font-semibold transition
            ${
              isFormValid && !submitting
                ? "bg-green-700 text-white hover:bg-green-800"
                : "cursor-not-allowed bg-gray-300 text-gray-500"
            }`}
        >
          {submitting ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}

export default Checkout;
