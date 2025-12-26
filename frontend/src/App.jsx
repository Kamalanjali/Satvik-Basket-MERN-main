import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useCallback } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Addresses from "./pages/Addresses";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";

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
    <BrowserRouter
    future={{
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  }}>
      <Header
        onSearch={handleSearch}
        cartItemCount={cartItemCount}
        onCartToggle={handleCartToggle}
      />

      <Routes>
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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/addresses" element={<Addresses />} />
        <Route path="/checkout" element={<Checkout cartItems={cartItems} setCartItems={setCartItems} />} />
        <Route path="/order-success" element={<OrderSuccess />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
