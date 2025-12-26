function ProductCard({
  product,
  cartItems,
  onAddToCart,
  onIncrease,
  onDecrease,
  onClick,
}) {
  const cartItem = cartItems?.find(
    (item) => (item._id || item.id) === (product._id || product.id)
  );

  return (
    <div
      className="group cursor-pointer rounded-lg border border-[#e6d9c8] bg-white p-5 shadow-sm
                 transition-transform duration-300 ease-out
                 hover:scale-105 hover:shadow-lg"
      onClick={onClick}
    >
      {/* Image */}
      <div className="mb-4 h-40 overflow-hidden rounded-md bg-[#f5efe6]">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover
                       transition-transform duration-300
                       group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[#8b6f55]">
            <span className="text-sm">No Image</span>
          </div>
        )}
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

        {/* Quantity Controls */}
        {cartItem ? (
          <div
            className="flex items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => onDecrease(cartItem._id || cartItem.id)}
              className="rounded-md bg-[#e6d9c8] px-3 py-1 text-lg font-bold"
            >
              −
            </button>

            <span className="min-w-[20px] text-center font-medium">
              {cartItem.quantity}
            </span>

            <button
              onClick={() => onIncrease(cartItem._id || cartItem.id)}
              className="rounded-md bg-[#e6d9c8] px-3 py-1 text-lg font-bold"
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white
                       transition-colors duration-200
                       hover:bg-green-800"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
