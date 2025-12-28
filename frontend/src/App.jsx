import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useCallback } from "react";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";

import Header from "./components/Header";
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

  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <>
      <Toaster position="top-right" />

      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Header
          onSearch={handleSearch}
          cartItemCount={cartItemCount}
          onCartToggle={handleCartToggle}
        />

        <Routes>
          {/* Public */}
          <Route
            path="/"
            element={
              <Home
                searchQuery={searchQuery}
                cartItems={cartItems}
                setCartItems={setCartItems}
                cartOpen={cartOpen}
                setCartOpen={setCartOpen}
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
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Protected */}
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
              <Checkout
                cartItems={cartItems}
                setCartItems={setCartItems}
              />
            }
          />

          <Route
            path="/order-success"
            element={<OrderSuccess />}
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
