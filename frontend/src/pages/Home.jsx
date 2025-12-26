import { useState, useEffect, useCallback } from "react";
import ProductGrid from "../components/ProductGrid";
import Cart from "../components/Cart";
import Footer from "../components/Footer";
import { productApi } from "../services/api";
import ProductModal from "../components/ProductModal";

function Home({ searchQuery, cartItems, setCartItems, cartOpen, setCartOpen }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  /* ---------------- FETCH PRODUCTS ---------------- */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productApi.getAll();
        const data = response.data?.products || response.data || [];
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* ---------------- SEARCH FILTER ---------------- */
  useEffect(() => {
    if (!searchQuery?.trim()) {
      setFilteredProducts(products);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredProducts(
        products.filter(
          (product) =>
            product.name?.toLowerCase().includes(query) ||
            product.description?.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, products]);

  /* ---------------- CART LOGIC (SINGLE SOURCE) ---------------- */

  // Add or increase quantity
  const handleAddToCart = useCallback(
    (product) => {
      setCartItems((prev) => {
        const existing = prev.find(
          (item) => (item._id || item.id) === (product._id || product.id)
        );

        if (existing) {
          return prev.map((item) =>
            (item._id || item.id) === (product._id || product.id)
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }

        return [...prev, { ...product, quantity: 1 }];
      });
    },
    [setCartItems]
  );

  // Increase quantity
  const increaseQty = useCallback(
    (productId) => {
      setCartItems((prev) =>
        prev.map((item) =>
          (item._id || item.id) === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    },
    [setCartItems]
  );

  // Decrease quantity (remove if 0)
  const decreaseQty = useCallback(
    (productId) => {
      setCartItems((prev) =>
        prev
          .map((item) =>
            (item._id || item.id) === productId
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
          .filter((item) => item.quantity > 0)
      );
    },
    [setCartItems]
  );

  // Remove item completely
  const handleRemoveItem = useCallback(
    (productId) => {
      setCartItems((prev) =>
        prev.filter((item) => (item._id || item.id) !== productId)
      );
    },
    [setCartItems]
  );

  return (
    <div className="min-h-screen bg-[#fdf9f3]">
      {/* ---------------- HERO ---------------- */}
      <section className="bg-[#f5efe6] py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <span className="inline-block mb-6 rounded-full bg-green-700 px-6 py-2 text-sm font-semibold text-white shadow">
            ✦ Pure • Organic • Traditional ✦
          </span>

          <h1 className="mb-6 text-4xl md:text-5xl font-serif font-bold text-[#2f241c]">
            Welcome to <span className="text-green-800">Satvik Basket</span>
          </h1>

          <p className="mb-6 text-lg leading-relaxed text-[#6b4f3f]">
            Bringing the essence of traditional Indian kitchens to your home.
          </p>

          <p className="italic text-[#8b6f55]">
            “From our home to yours — pure, wholesome, and made with love.”
          </p>
        </div>
      </section>

      {/* ---------------- PRODUCTS ---------------- */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="mb-10">
          <h2 className="mb-2 text-3xl font-serif font-bold text-[#2f241c]">
            Our Products
          </h2>
          <p className="text-[#6b4f3f]">
            Explore our collection of traditional homemade essentials
          </p>
        </div>

        <ProductGrid
          products={filteredProducts}
          loading={loading}
          error={error}
          cartItems={cartItems}
          onAddToCart={handleAddToCart}
          onIncrease={increaseQty}
          onDecrease={decreaseQty}
          onProductClick={setSelectedProduct}
        />

        {/* ---------------- MODAL ---------------- */}
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            cartItems={cartItems}
            onAddToCart={handleAddToCart}
            onIncrease={increaseQty}
            onDecrease={decreaseQty}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </main>

      <Footer />

      {/* ---------------- CART DRAWER ---------------- */}
      <Cart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={(id, qty) =>
          qty > 0 ? increaseQty(id) : decreaseQty(id)
        }
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
}

export default Home;
