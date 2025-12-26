import { useEffect, useState } from "react";
import { addressApi } from "../services/api";

function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await addressApi.getAll();
        console.log("ADDRESSES:", res.data);
        setAddresses(res.data);
      } catch (error) {
        console.error("Failed to fetch addresses", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  return (
    <div className="min-h-screen bg-[#fdf9f3] px-4 py-16">
      <div className="mx-auto max-w-xl rounded-lg bg-white border border-[#e6d9c8] p-8 shadow-sm">
        <h1 className="mb-6 text-2xl font-serif font-bold text-[#2f241c]">
          Saved Addresses
        </h1>

        {loading && <p>Loading addresses...</p>}

        {!loading && addresses.length === 0 && (
          <p className="text-[#6b4f3f]">No saved addresses found.</p>
        )}

        {addresses.map((addr) => (
          <div
            key={addr._id}
            className="mb-4 rounded border border-[#e6d9c8] p-4"
          >
            <p className="font-medium">{addr.fullName}</p>
            <p className="text-sm text-[#6b4f3f]">
              {addr.addressLine1},{" "}
              {addr.addressLine2 && `${addr.addressLine2}, `}
              {addr.city}, {addr.state} - {addr.pincode}
            </p>
            <p className="text-sm text-[#6b4f3f]">{addr.phone}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Addresses;
