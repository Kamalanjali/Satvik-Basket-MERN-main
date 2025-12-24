import { useState , useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { authApi } from "../services/api";
import { isLoggedIn } from "../utils/auth";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const res = await authApi.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      // AUTO LOGIN AFTER REGISTER
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf9f3] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#e6d9c8]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center h-16">
            <Link
              to="/"
              className="flex items-center gap-2 text-[#6b4f3f] hover:text-green-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Shop</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Register Form */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="rounded-lg bg-white border border-[#e6d9c8] p-8 shadow-sm">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-serif font-bold text-green-800 mb-2">
                Satvik Basket
              </h1>
              <p className="text-[#6b4f3f]">Create your account</p>
            </div>

            {error && (
              <div className="mb-6 rounded-md border border-[#e7b8b8] bg-[#fdecec] p-3">
                <p className="text-sm text-[#8b3a3a]">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-[#3b2f2f] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full rounded-md border border-[#e6d9c8] bg-white px-4 py-2 text-sm
                             focus:outline-none focus:ring-2 focus:ring-green-700"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-[#3b2f2f] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full rounded-md border border-[#e6d9c8] bg-white px-4 py-2 text-sm
                             focus:outline-none focus:ring-2 focus:ring-green-700"
                />
              </div>

              {/* Password */}
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
                    placeholder="••••••••"
                    className="w-full rounded-md border border-[#e6d9c8] bg-white px-4 py-2 pr-10 text-sm
                               focus:outline-none focus:ring-2 focus:ring-green-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b6f55] hover:text-green-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-[#3b2f2f] mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full rounded-md border border-[#e6d9c8] bg-white px-4 py-2 pr-10 text-sm
                               focus:outline-none focus:ring-2 focus:ring-green-700"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b6f55] hover:text-green-800"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-green-700 py-3 text-sm font-semibold text-white
                           hover:bg-green-800 transition-colors
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <p className="mt-6 text-center text-[#6b4f3f]">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-green-700 hover:text-green-800"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Register;
