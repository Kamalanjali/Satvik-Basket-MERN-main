import ProductCard from "./ProductCard";
import { Loader2 } from "lucide-react";

function ProductGrid({ products, loading, error, onAddToCart }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-green-700" />
        <span className="mt-3 text-sm text-[#6b4f3f]">
          Loading products...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-24 text-center">
        <p className="mb-2 text-lg font-semibold text-[#8b3a3a]">
          Failed to load products
        </p>
        <p className="text-sm text-[#6b4f3f]">
          {error}
        </p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-lg text-[#6b4f3f]">
          No products found
        </p>
        <p className="mt-1 text-sm text-[#8b6f55]">
          Try adjusting your search or check back later
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product._id || product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}

export default ProductGrid;
