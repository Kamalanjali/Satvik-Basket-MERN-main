import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { orderApi, addressApi } from "../services/api";
import { openRazorpayCheckout } from "../utils/razorpayCheckout";
import toast from "react-hot-toast";

function Checkout({ cartItems, setCartItems }) {
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [paying, setPaying] = useState(false);

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

  /* ================= Fetch addresses ================= */
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await addressApi.getAll();
        setAddresses(res.data || []);
        if (res.data?.length) setSelectedAddressId(res.data[0]._id);
      } catch {
        toast.error("Failed to load addresses");
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
      toast.error("Please fill all required fields");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(newAddress.phone)) {
      toast.error("Enter a valid 10-digit mobile number");
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

      toast.success("Address added");
    } catch {
      toast.error("Failed to save address");
    }
  };

  /* ================= Place order + Pay ================= */
  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Please select a delivery address");
      return;
    }

    try {
      setSubmitting(true);

      // 1️⃣ Create order
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

      // 2️⃣ Start payment
      setPaying(true);

      await openRazorpayCheckout({
        orderId,
        onSuccess: () => {
          setPaying(false);
          
          navigate("/order-success", {
            state: { orderId, totalAmount },
          });
          // Clear cart After navigation
          setTimeout(() => {
            setCartItems([]);
          }, 0);
        },
        onFailure: () => {
          setPaying(false);
        },
      });
    } catch (err) {
      console.error(err);
      toast.error("Unable to place order");
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= Empty cart ================= */
  if (!cartItems.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="mb-4 text-xl font-semibold">Your cart is empty</h2>
        <Link to="/" className="text-green-700 font-medium">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const disabled = submitting || paying;

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-[#fdf9f3]">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h1 className="mb-10 text-3xl font-serif font-bold">Checkout</h1>

        {/* Cart summary */}
        <div className="mb-8 rounded bg-white p-6 shadow">
          {cartItems.map((item) => (
            <div key={item._id || item.id} className="flex justify-between py-2">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span className="font-semibold">
                ₹{item.price * item.quantity}
              </span>
            </div>
          ))}
        </div>

        {/* Address selection */}
        <div className="mb-8 rounded bg-white p-6 shadow">
          <h2 className="mb-4 font-semibold">Delivery Address</h2>

          {addresses.map((addr) => (
            <div
              key={addr._id}
              onClick={() => setSelectedAddressId(addr._id)}
              className={`mb-3 cursor-pointer rounded border p-3 ${
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
            disabled={disabled}
            onClick={() => setShowNewAddressForm(!showNewAddressForm)}
            className="text-sm text-green-700 font-medium"
          >
            + Add new address
          </button>

          {showNewAddressForm && (
            <div className="mt-4 grid gap-2">
              {Object.keys(newAddress).map((field) => (
                <input
                  key={field}
                  placeholder={field}
                  value={newAddress[field]}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, [field]: e.target.value })
                  }
                  className="border p-2 rounded"
                />
              ))}
              <button
                disabled={disabled}
                onClick={handleSaveNewAddress}
                className="bg-green-700 text-white py-2 rounded"
              >
                Save Address
              </button>
            </div>
          )}
        </div>

        {/* Total */}
        <div className="flex justify-between bg-[#f5efe6] p-6 rounded">
          <span className="font-semibold">Total</span>
          <span className="font-bold text-green-800">₹{totalAmount}</span>
        </div>

        {/* Pay button */}
        <button
          disabled={disabled}
          onClick={handlePlaceOrder}
          className={`mt-8 w-full py-4 rounded font-semibold ${
            disabled
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-700 text-white hover:bg-green-800"
          }`}
        >
          {paying
            ? "Processing payment..."
            : submitting
            ? "Placing order..."
            : "Pay & Place Order"}
        </button>
      </div>
    </div>
  );
}

export default Checkout;
