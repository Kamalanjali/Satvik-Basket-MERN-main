import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useCallback } from "react";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import OAuthSuccess from "./pages/OAuthSuccess";

import Header from "./components/Header";
import Cart from "./components/Cart";
import PublicRoute from "./components/PublicRoute";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const handleCartToggle = useCallback(() => {
    setCartOpen((prev) => !prev);
  }, []);

  // 🔧 Cart item helpers (REQUIRED for Cart.jsx)
  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) return;
    setCartItems((items) =>
      items.map((item) =>
        (item._id || item.id) === id ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((items) =>
      items.filter((item) => (item._id || item.id) !== id)
    );
  };

  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <>
      <Toaster position="top-right" />

      <BrowserRouter>
        <Header
          onSearch={handleSearch}
          cartItemCount={cartItemCount}
          onCartToggle={handleCartToggle}
        />

        {/* ✅ CART TOGGLE – GLOBAL */}
        <Cart
          isOpen={cartOpen}
          items={cartItems}
          onClose={handleCartToggle}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
        />

        <Routes>
          <Route
            path="/"
            element={
              <Home
                searchQuery={searchQuery}
                cartItems={cartItems}
                setCartItems={setCartItems}
              />
            }
          />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <Checkout cartItems={cartItems} setCartItems={setCartItems} />
            }
          />
          <Route path="/oauth-success" element={<OAuthSuccess />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
