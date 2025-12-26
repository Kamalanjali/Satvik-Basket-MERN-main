function ProductModal({
  product,
  cartItems,
  onAddToCart,
  onIncrease,
  onDecrease,
  onClose,
}) {
  const cartItem = cartItems?.find(
    (item) => (item._id || item.id) === (product._id || product.id)
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl rounded-lg bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-2xl text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="h-80 overflow-hidden rounded-lg bg-[#f5efe6]">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <h2 className="mb-2 text-2xl font-serif font-semibold text-[#2f241c]">
                {product.name}
              </h2>

              <p className="mb-4 text-[#6b4f3f]">
                {product.description}
              </p>

              <p className="text-xl font-bold text-green-800">
                ₹{product.price}
              </p>
            </div>

            {cartItem ? (
              <div
                className="mt-6 flex items-center gap-4"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() =>
                    onDecrease(cartItem._id || cartItem.id)
                  }
                  className="rounded-md bg-[#e6d9c8] px-4 py-2 text-lg font-bold"
                >
                  −
                </button>

                <span className="min-w-[24px] text-center text-lg font-medium">
                  {cartItem.quantity}
                </span>

                <button
                  onClick={() =>
                    onIncrease(cartItem._id || cartItem.id)
                  }
                  className="rounded-md bg-[#e6d9c8] px-4 py-2 text-lg font-bold"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                onClick={() => onAddToCart(product)}
                className="mt-6 rounded bg-green-700 px-6 py-3 text-white hover:bg-green-800 transition"
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
