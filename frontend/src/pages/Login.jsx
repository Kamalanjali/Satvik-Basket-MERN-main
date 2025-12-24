import { useState, useEffect } from "react";
import { isLoggedIn } from "../utils/auth";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { authApi } from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isLoggedIn()) {
      alert("You are already logged in.");
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const res = await authApi.login({
        email: formData.email,
        password: formData.password,
      });

      // SAVE AUTH DATA
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf9f3] flex flex-col">
      <header className="bg-white border-b border-[#e6d9c8]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center h-16">
            <Link
              to="/"
              className="flex items-center gap-2 text-[#6b4f3f] hover:text-green-700"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Shop</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="rounded-lg bg-white border border-[#e6d9c8] p-8 shadow-sm">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-serif font-bold text-green-800 mb-2">
                Satvik Basket
              </h1>
              <p className="text-[#6b4f3f]">Sign in to your account</p>
            </div>

            {error && (
              <div className="mb-6 rounded-md border border-[#e7b8b8] bg-[#fdecec] p-3">
                <p className="text-sm text-[#8b3a3a]">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#3b2f2f] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-md border border-[#e6d9c8] px-4 py-2 text-sm
                             focus:outline-none focus:ring-2 focus:ring-green-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#3b2f2f] mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full rounded-md border border-[#e6d9c8] px-4 py-2 pr-10 text-sm
                               focus:outline-none focus:ring-2 focus:ring-green-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b6f55]"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-green-700 py-3 text-sm font-semibold text-white
                           hover:bg-green-800 disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="mt-6 text-center text-[#6b4f3f]">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-green-700 hover:text-green-800"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;
