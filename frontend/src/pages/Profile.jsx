import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi, userApi } from "../services/api";
import { Pencil, Trash2, Star } from "lucide-react";
import toast from "react-hot-toast";

/* ---------------- helpers ---------------- */
const emptyForm = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
};

const sortAddresses = (addresses, defaultId) => [
  ...addresses.filter((a) => a._id === defaultId),
  ...addresses.filter((a) => a._id !== defaultId),
];

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [defaultAddressId, setDefaultAddressId] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- load user ---------------- */
  const loadUser = async () => {
    try {
      const res = await authApi.me();
      const u = res.data.user;

      setUser(u);
      setAddresses(u.addresses || []);
      setDefaultAddressId(u.defaultAddress || null);
    } catch (err) {
      // 🔐 token invalid / expired → force logout
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    }
  };

  useEffect(() => {
    loadUser().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------- persist profile ---------------- */
  const persistProfile = async (updatedAddresses, newDefault) => {
    try {
      await userApi.updateProfile({
        addresses: updatedAddresses,
        defaultAddress: newDefault,
      });

      await loadUser();
    } catch {
      toast.error("Failed to update profile");
    }
  };

  /* ---------------- save address ---------------- */
  const handleSave = async () => {
    if (
      !form.fullName ||
      !form.phone ||
      !form.addressLine1 ||
      !form.city ||
      !form.state ||
      !form.pincode
    ) {
      toast.error("Fill all required fields");
      return;
    }

    let updated;

    if (form._id) {
      updated = addresses.map((a) =>
        a._id === form._id ? { ...a, ...form } : a
      );
    } else {
      updated = [...addresses, form];
    }

    const newDefault = defaultAddressId || updated[0]?._id || null;

    await persistProfile(updated, newDefault);
    setForm(null);
    toast.success("Address saved");
  };

  /* ---------------- delete address ---------------- */
  const handleDelete = async (id) => {
    const updated = addresses.filter((a) => a._id !== id);

    let newDefault = defaultAddressId;
    if (id === defaultAddressId) {
      newDefault = updated[0]?._id || null;
    }

    await persistProfile(updated, newDefault);
    toast.success("Address deleted");
  };

  /* ---------------- set default ---------------- */
  const handleSetDefault = async (id) => {
    await persistProfile(addresses, id);
    toast.success("Default address updated");
  };

  if (loading) return <p className="p-8">Loading…</p>;
  if (!user) return null;

  const sorted = sortAddresses(addresses, defaultAddressId);

  return (
    <div className="min-h-screen bg-[#fdf9f3] px-4 py-12">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Profile */}
        <div className="bg-white p-6 rounded border">
          <h2 className="text-xl font-bold">Profile</h2>
          <p>{user.name}</p>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>

        {/* Addresses */}
        <div className="bg-white p-6 rounded border space-y-4">
          <div className="flex justify-between">
            <h2 className="text-xl font-bold">Saved Addresses</h2>
            <button
              onClick={() => setForm(emptyForm)}
              className="bg-green-700 text-white px-3 py-1 rounded"
            >
              + Add Address
            </button>
          </div>

          {sorted.map((addr) => (
            <div
              key={addr._id}
              className="border rounded p-4 flex justify-between items-start"
            >
              <div>
                <p className="font-medium">
                  {addr.fullName}
                  {addr._id === defaultAddressId && (
                    <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 rounded">
                      DEFAULT
                    </span>
                  )}
                </p>
                <p className="text-sm">
                  {addr.addressLine1}
                  {addr.addressLine2 && `, ${addr.addressLine2}`}
                </p>
                <p className="text-sm">
                  {addr.city}, {addr.state} - {addr.pincode}
                </p>
                <p className="text-sm">{addr.phone}</p>
              </div>

              <div className="flex flex-col gap-2 text-sm">
                {addr._id !== defaultAddressId && (
                  <button
                    onClick={() => handleSetDefault(addr._id)}
                    className="p-1 rounded hover:bg-green-100"
                    title="Set as default"
                  >
                    <Star size={16} className="text-green-700" />
                  </button>
                )}

                <button
                  onClick={() => setForm(addr)}
                  title="Edit address"
                >
                  <Pencil size={16} className="text-gray-600 hover:text-gray-800" />
                </button>

                <button
                  onClick={() => handleDelete(addr._id)}
                  title="Delete address"
                >
                  <Trash2 size={14} className="text-red-600 hover:text-red-700" />
                </button>
              </div>
            </div>
          ))}

          {form && (
            <div className="grid gap-2 border-t pt-4">
              {Object.keys(emptyForm).map((f) => (
                <input
                  key={f}
                  placeholder={f}
                  value={form[f] || ""}
                  onChange={(e) =>
                    setForm({ ...form, [f]: e.target.value })
                  }
                  className="border p-2 rounded"
                />
              ))}
              <button
                onClick={handleSave}
                className="bg-green-700 text-white py-2 rounded"
              >
                Save Address
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
