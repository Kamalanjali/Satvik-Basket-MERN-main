import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { orderApi, addressApi } from "../services/api";

function Checkout({ cartItems, setCartItems }) {
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    email: "",
    phone: "",
    addressLine1: "",
    city: "",
    state: "",
    pincode: "",
  });

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  /* ================= Fetch saved addresses ================= */
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await addressApi.getAll();
        setAddresses(res.data || []);

        if (res.data?.length > 0) {
          setSelectedAddressId(res.data[0]._id);
        }
      } catch (error) {
        console.error("Failed to fetch addresses", error);
      }
    };

    fetchAddresses();
  }, []);

  /* ================= Save new address ================= */
  const handleSaveNewAddress = async () => {
    if (
      !newAddress.fullName ||
      !newAddress.phone ||
      !newAddress.addressLine1 ||
      !newAddress.city ||
      !newAddress.state ||
      !newAddress.pincode
    ) {
      alert("Please fill all required address fields");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(newAddress.phone)) {
      alert("Enter a valid 10-digit Indian mobile number");
      return;
    }

    try {
      await addressApi.add(newAddress);

      const updated = await addressApi.getAll();
      setAddresses(updated.data);

      const lastAdded = updated.data[updated.data.length - 1];
      setSelectedAddressId(lastAdded._id);

      setNewAddress({
        fullName: "",
        email: "",
        phone: "",
        addressLine1: "",
        city: "",
        state: "",
        pincode: "",
      });

      setShowNewAddressForm(false);
    } catch (error) {
      alert("Failed to save address");
    }
  };

  /* ================= Place order ================= */
  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      alert("Please select a delivery address");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        addressId: selectedAddressId,
        orderItems: cartItems.map((item) => ({
          product: item._id || item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        paymentMethod: "RAZORPAY",
        totalAmount,
      };

      const res = await orderApi.create(payload);

      setCartItems([]);

      navigate("/order-success", {
        state: {
          orderId: res.data.order._id,
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

  /* ================= Empty cart ================= */
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#fdf9f3] flex flex-col items-center justify-center">
        <h2 className="mb-4 text-2xl font-serif font-bold text-[#2f241c]">
          Your cart is empty
        </h2>
        <Link
          to="/"
          className="rounded bg-green-700 px-6 py-3 text-white hover:bg-green-800"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf9f3]">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h1 className="mb-10 text-3xl font-serif font-bold text-[#2f241c]">
          Checkout
        </h1>

        {/* ================= Cart Summary ================= */}
        <div className="mb-10 rounded-lg bg-white p-6 shadow">
          {cartItems.map((item) => (
            <div
              key={item._id || item.id}
              className="flex justify-between border-b py-4 last:border-b-0"
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

        {/* ================= Address Selection ================= */}
        <div className="mb-10 rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-serif font-semibold text-[#2f241c]">
            Delivery Address
          </h2>

          {addresses.map((addr) => (
            <div
              key={addr._id}
              onClick={() => setSelectedAddressId(addr._id)}
              className={`mb-4 cursor-pointer rounded border p-4
                ${
                  selectedAddressId === addr._id
                    ? "border-green-700 bg-green-50"
                    : "border-gray-300"
                }`}
            >
              <p className="font-medium">{addr.fullName}</p>
              <p className="text-sm text-gray-600">
                {addr.addressLine1}, {addr.city} – {addr.pincode}
              </p>
              <p className="text-sm text-gray-600">{addr.phone}</p>
            </div>
          ))}

          {/* Add new address toggle */}
          <button
            onClick={() => setShowNewAddressForm(!showNewAddressForm)}
            className="text-sm font-medium text-green-700"
          >
            + Add new address
          </button>

          {/* ================= New Address Form ================= */}
          {showNewAddressForm && (
            <div className="mt-4 rounded border p-4">
              <div className="grid grid-cols-1 gap-3">
                <input
                  placeholder="Full Name"
                  value={newAddress.fullName}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, fullName: e.target.value })
                  }
                  className="border p-2 rounded"
                />

                <input
                  placeholder="Email"
                  value={newAddress.email}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, email: e.target.value })
                  }
                  className="border p-2 rounded"
                />

                <input
                  placeholder="Phone Number"
                  value={newAddress.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(-10);
                    setNewAddress({ ...newAddress, phone: e.target.value });
                  }}
                  className="border p-2 rounded"
                />

                <input
                  placeholder="Address"
                  value={newAddress.addressLine1}
                  onChange={(e) =>
                    setNewAddress({
                      ...newAddress,
                      addressLine1: e.target.value,
                    })
                  }
                  className="border p-2 rounded"
                />

                <input
                  placeholder="City"
                  value={newAddress.city}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, city: e.target.value })
                  }
                  className="border p-2 rounded"
                />

                <input
                  placeholder="State"
                  value={newAddress.state}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, state: e.target.value })
                  }
                  className="border p-2 rounded"
                />

                <input
                  placeholder="Pincode"
                  value={newAddress.pincode}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, pincode: e.target.value })
                  }
                  className="border p-2 rounded"
                />

                <button
                  onClick={handleSaveNewAddress}
                  className="rounded bg-green-700 py-2 text-white"
                >
                  Save Address
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ================= Total ================= */}
        <div className="flex justify-between rounded-lg bg-[#f5efe6] p-6">
          <span className="text-lg font-semibold text-[#2f241c]">
            Total Amount
          </span>
          <span className="text-2xl font-bold text-green-800">
            ₹{totalAmount}
          </span>
        </div>

        {/* ================= Place Order ================= */}
        <button
          disabled={!selectedAddressId || submitting}
          onClick={handlePlaceOrder}
          className={`mt-8 w-full rounded py-4 text-lg font-semibold
            ${
              selectedAddressId && !submitting
                ? "bg-green-700 text-white hover:bg-green-800"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
        >
          {submitting ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}

export default Checkout;
