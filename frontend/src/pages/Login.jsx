import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, X } from "lucide-react";
import { authApi } from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* Forgot password modal */
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  /* Already logged in */
  useEffect(() => {
    authApi
      .me()
      .then(() => navigate("/", { replace: true }))
      .catch(() => {});
  }, [navigate]);

  /* Login */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      await authApi.login({ email, password, rememberMe });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  /* Reset password */
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetError("");

    if (!resetEmail || !newPassword || !confirmPassword) {
      setResetError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetError("Passwords do not match");
      return;
    }

    try {
      setResetLoading(true);
      await authApi.resetPassword({ email: resetEmail, newPassword });
      setShowResetModal(false);
      navigate("/");
    } catch (err) {
      setResetError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf9f3] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center">
          <Link to="/" className="flex items-center gap-2 text-[#6b4f3f]">
            <ArrowLeft size={18} /> Back to Shop
          </Link>
        </div>
      </header>

      {/* Login */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white border rounded-lg p-8 shadow-sm">
          <h1 className="text-3xl font-serif font-bold text-green-800 text-center">
            Satvik Basket
          </h1>
          <p className="text-center text-[#6b4f3f] mb-6">
            Sign in to your account
          </p>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-300 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Google */}
          <button
            onClick={() => {
              window.location.href = `${
                import.meta.env.VITE_API_BASE_URL
              }/auth/google`;
            }}
            className="w-full flex items-center justify-center gap-3 border rounded-md py-2.5 hover:bg-[#f5efe6]"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="h-5 w-5"
            />
            Continue with Google
          </button>

          <div className="my-5 text-center text-xs text-[#8b6f55]">
            or sign in with email
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-md px-3 py-2 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setResetEmail(email);
                setShowResetModal(true);
              }}
              className="text-xs text-green-700 hover:underline"
            >
              Forgot password?
            </button>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Keep me logged in
            </label>

            <button
              disabled={loading}
              className="w-full bg-green-700 text-white py-2.5 rounded-md"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </main>

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm relative">
            <button
              onClick={() => setShowResetModal(false)}
              className="absolute top-3 right-3"
            >
              <X size={18} />
            </button>

            <h2 className="text-lg font-semibold mb-4">Reset Password</h2>

            {resetError && (
              <div className="mb-3 text-sm text-red-700 bg-red-50 p-2 border">
                {resetError}
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              />

              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              <button
                disabled={resetLoading}
                className="w-full bg-green-700 text-white py-2 rounded-md"
              >
                {resetLoading ? "Updating..." : "Update password"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
