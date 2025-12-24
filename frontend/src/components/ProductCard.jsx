function ProductCard({ product, onAddToCart }) {
  return (
    <div className="rounded-lg border border-[#e6d9c8] bg-white p-5 shadow-sm hover:shadow-md transition">
      {/* Image placeholder */}
      <div className="mb-4 flex h-40 items-center justify-center rounded-md bg-[#f5efe6] text-[#8b6f55]">
        <span className="text-sm">Product Image</span>
      </div>

      {/* Product Info */}
      <h3 className="mb-1 text-lg font-serif font-semibold text-[#2f241c]">
        {product.name}
      </h3>

      <p className="mb-3 text-sm text-[#6b4f3f] line-clamp-2">
        {product.description || "Traditional homemade product"}
      </p>

      {/* Price + Action */}
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-green-800">
          ₹{product.price}
        </span>

        <button
          onClick={() => onAddToCart(product)}
          className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white
                     hover:bg-green-800 transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
