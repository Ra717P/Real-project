import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

  const total = cart.reduce(
    (sum, item) =>
      sum + parseInt(item.price.replace(/\D/g, "")) * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">
          Keranjang masih kosong
        </h1>
        <Link
          to="/menu"
          className="px-5 py-2 bg-[#e0b882] text-white rounded-lg hover:bg-[#d4a373] transition"
        >
          Lihat Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfbf7] p-4 sm:p-6 md:p-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">
        Keranjang Saya
      </h1>

      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6 md:p-8">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row items-center justify-between border-b py-3 gap-4"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 rounded object-cover"
              />
              <div>
                <h2 className="font-semibold">{item.name}</h2>
                <p className="text-sm text-gray-500">{item.category}</p>

                {/* Qty control di Cart */}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.id, Math.max(1, item.quantity - 1))
                    }
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="px-3">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="font-semibold">{item.price}</p>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 text-sm hover:underline"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}

        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
          <p className="text-xl font-bold">
            Total: Rp {total.toLocaleString()}
          </p>
          <div className="flex gap-4">
            <button
              onClick={clearCart}
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            >
              Kosongkan
            </button>
            <Link
              to="/checkout"
              className="px-5 py-2 bg-[#e0b882] text-white rounded-lg hover:bg-[#d4a373] transition"
            >
              Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
