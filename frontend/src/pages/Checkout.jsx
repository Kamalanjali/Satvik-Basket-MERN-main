import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { orderApi, addressApi } from "../services/api";
import { openRazorpayCheckout } from "../utils/razorpayCheckout";

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
        if (res.data?.length) {
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
      setSelectedAddressId(updated.data.at(-1)._id);
      setShowNewAddressForm(false);

      setNewAddress({
        fullName: "",
        email: "",
        phone: "",
        addressLine1: "",
        city: "",
        state: "",
        pincode: "",
      });
    } catch {
      alert("Failed to save address");
    }
  };

  /* ================= Place order + Pay ================= */
  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      alert("Please select a delivery address");
      return;
    }

    try {
      setSubmitting(true);

      const res = await orderApi.create({
        addressId: selectedAddressId,
        orderItems: cartItems.map((item) => ({
          product: item._id || item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        paymentMethod: "RAZORPAY",
        totalAmount,
      });

      const orderId = res.data.order._id;

      await openRazorpayCheckout({
        orderId,
        onSuccess: () => {
          setCartItems([]);
          navigate("/order-success", { state: { orderId } });
        },
      });
    } catch (error) {
      console.error("Order / Payment failed:", error);
      alert("Order / Payment failed. Please try again.");
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

  /* ================= UI ================= */
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
              className={`mb-4 cursor-pointer rounded border p-4 ${
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

          <button
            onClick={() => setShowNewAddressForm(!showNewAddressForm)}
            className="text-sm font-medium text-green-700"
          >
            + Add new address
          </button>

          {showNewAddressForm && (
            <div className="mt-4 rounded border p-4">
              <div className="grid grid-cols-1 gap-3">
                {Object.keys(newAddress).map((field) => (
                  <input
                    key={field}
                    placeholder={field.replace(/([A-Z])/g, " $1")}
                    value={newAddress[field]}
                    onChange={(e) =>
                      setNewAddress({
                        ...newAddress,
                        [field]: e.target.value,
                      })
                    }
                    className="border p-2 rounded"
                  />
                ))}

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
          disabled={submitting}
          onClick={handlePlaceOrder}
          className={`mt-8 w-full rounded py-4 text-lg font-semibold ${
            submitting
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-700 text-white hover:bg-green-800"
          }`}
        >
          {submitting ? "Processing..." : "Pay & Place Order"}
        </button>
      </div>
    </div>
  );
}

export default Checkout;
