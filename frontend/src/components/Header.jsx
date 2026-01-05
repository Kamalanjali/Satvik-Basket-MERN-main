import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart } from "lucide-react";
import { authApi } from "../services/api";

function Header({ onSearch, cartItemCount = 0, onCartToggle }) {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  /* ===============================
     Fetch user ONCE if token exists
  ================================ */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoadingAuth(false);
      setUser(null);
      return;
    }

    authApi
      .me()
      .then((res) => setUser(res.data.user))
      .catch(() => {
        // token invalid → hard logout
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setLoadingAuth(false));
  }, []);

  /* ===============================
     Close dropdown on outside click
  ================================ */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setProfileOpen(false);
    navigate("/login", { replace: true });
  };

  const getInitials = (name = "") => {
    const parts = name.trim().split(" ");
    return parts.length === 1
      ? parts[0][0]?.toUpperCase()
      : (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#e6d9c8]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-serif font-bold text-green-800"
          >
            Satvik Basket
          </Link>

          {/* Search */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-md mx-8"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8b6f55]" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search products..."
                className="w-full rounded-md border border-[#e6d9c8] px-4 py-2 pl-10 text-sm
                           focus:outline-none focus:ring-2 focus:ring-green-700"
              />
            </div>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <button
              onClick={onCartToggle}
              className="relative rounded-md border border-[#e6d9c8] bg-white p-2 hover:bg-[#f5efe6]"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center
                                 justify-center rounded-full bg-green-700 text-xs text-white">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Auth */}
            {!loadingAuth && !user && (
              <Link
                to="/login"
                className="rounded-md bg-green-700 px-5 py-2.5 text-sm text-white hover:bg-green-800"
              >
                Login
              </Link>
            )}

            {!loadingAuth && user && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileOpen((p) => !p)}
                  className="h-10 w-10 rounded-full bg-green-800 text-white font-semibold"
                >
                  {getInitials(user.name)}
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-60 rounded-md bg-white
                                  border border-[#e6d9c8] shadow-lg">
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-[#6b4f3f]">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-[#f5efe6]"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 hover:bg-[#f5efe6]"
                    >
                      Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-[#8b3a3a] hover:bg-[#fdecec]"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
