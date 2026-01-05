import { useEffect, useState } from "react";
import { authApi } from "../services/api";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authApi
      .me()
      .then((res) => {
        setUser(res.data.user);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdf9f3] flex items-center justify-center">
        <p className="text-[#6b4f3f]">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#fdf9f3] flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-[#8b3a3a]">You are not logged in.</p>
          <button
            onClick={() => navigate("/login")}
            className="rounded-md bg-green-700 px-5 py-2 text-white hover:bg-green-800"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf9f3] px-4 py-16">
      <div className="mx-auto max-w-xl rounded-lg bg-white border border-[#e6d9c8] p-8 shadow-sm">
        <h1 className="mb-4 text-2xl font-serif font-bold text-[#2f241c]">
          Profile Details
        </h1>

        <div className="space-y-2 text-[#3b2f2f]">
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>

          <p className="mt-6 text-sm text-[#6b4f3f] italic">
            Profile editing will be available soon.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
