import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";

function Cart({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem }) {
  const navigate = useNavigate();

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (!isLoggedIn()) {
    navigate("/login");
    return;
  }
    onClose();
    navigate("/checkout");
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/30"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Cart Sidebar */}
      <aside className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white border-l border-[#e6d9c8]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e6d9c8] p-4">
          <h2 className="text-xl font-serif font-bold text-[#2f241c]">
            Your Cart
          </h2>
          <button
            onClick={onClose}
            className="rounded-md border border-[#e6d9c8] bg-white p-2
                       text-[#3b2f2f] hover:bg-[#f5efe6] transition-colors"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-[#6b4f3f]">
              <ShoppingBag className="mb-4 h-16 w-16 text-[#8b6f55]" />
              <p className="text-lg font-medium">Your cart is empty</p>
              <p className="mt-1 text-sm text-[#8b6f55]">
                Add some products to get started
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item._id || item.id}
                  className="flex gap-4 rounded-lg border border-[#e6d9c8] bg-[#fdf9f3] p-3"
                >
                  {/* Item Image */}
                  <div className="h-20 w-20 flex-shrink-0 rounded-md bg-[#f5efe6] overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-[#8b6f55]">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="flex flex-1 flex-col">
                    <h3 className="truncate font-medium text-[#2f241c]">
                      {item.name}
                    </h3>
                    <p className="font-bold text-green-800">
                      ₹{item.price?.toFixed(2) || "0.00"}
                    </p>

                    {/* Quantity Controls */}
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() =>
                          onUpdateQuantity(
                            item._id || item.id,
                            item.quantity - 1
                          )
                        }
                        className="rounded-md border border-[#e6d9c8] bg-white p-1
                                   hover:bg-[#f5efe6] transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4 text-[#3b2f2f]" />
                      </button>

                      <span className="w-8 text-center font-medium text-[#2f241c]">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          onUpdateQuantity(
                            item._id || item.id,
                            item.quantity + 1
                          )
                        }
                        className="rounded-md border border-[#e6d9c8] bg-white p-1
                                   hover:bg-[#f5efe6] transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4 text-[#3b2f2f]" />
                      </button>

                      <button
                        onClick={() =>
                          onRemoveItem(item._id || item.id)
                        }
                        className="ml-auto rounded-md p-1
                                   text-[#8b3a3a] hover:bg-[#fdecec] transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#e6d9c8] p-4 space-y-4">
            <div className="flex items-center justify-between text-lg">
              <span className="font-medium text-[#2f241c]">Total:</span>
              <span className="font-bold text-green-800">
                ₹{totalPrice.toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full rounded-md bg-green-700 py-3 text-sm font-semibold text-white
                         hover:bg-green-800 transition-colors"
            >
              Checkout
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

export default Cart;
