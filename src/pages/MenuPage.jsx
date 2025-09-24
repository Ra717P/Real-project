import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { menuItems } from "../data/menu";
import Pagination from "../components/Pagination";
import { useCart } from "../context/CartContext"; // ✅

export default function MenuPage() {
  const categories = [
    "All",
    "Signature",
    "Espresso Based",
    "Tea",
    "Flavour",
    "Mojito Mint",
    "Milk Based",
    "Etc",
  ];

  const [selected, setSelected] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const { cart, addToCart, removeFromCart, updateQuantity } = useCart(); // ✅ pakai updateQuantity

  // Filter menu
  const filteredItems =
    selected === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === selected);

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Ambil jumlah item di cart
  const getQuantity = (id) => {
    const found = cart.find((item) => item.id === id);
    return found ? found.quantity : 0;
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col">
      <Navbar />

      <main className="flex-1 p-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800">
          Menu Kami
        </h1>

        {/* Filter kategori */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
                selected === cat
                  ? "bg-[#d4a373] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => {
                setSelected(cat);
                setCurrentPage(1);
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid menu */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {paginatedItems.map((item) => {
            const quantity = getQuantity(item.id);

            return (
              <div
                key={item.id}
                className="bg-white shadow-md rounded-xl p-4 flex flex-col justify-between"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-28 sm:h-32 md:h-40 object-cover rounded-md mb-3"
                />
                <h2 className="text-sm sm:text-base font-semibold text-gray-800">
                  {item.name}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  {item.category}
                </p>
                <p className="text-sm sm:text-base font-bold text-gray-700 mt-1">
                  {item.price}
                </p>

                {/* Tombol + / - */}
                {quantity > 0 ? (
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => {
                        if (quantity > 1) {
                          updateQuantity(item.id, quantity - 1);
                        } else {
                          removeFromCart(item.id);
                        }
                      }}
                      className="px-3 py-1 bg-gray-200 rounded-md text-lg"
                    >
                      -
                    </button>
                    <span className="text-sm font-medium">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, quantity + 1)}
                      className="px-3 py-1 bg-gray-200 rounded-md text-lg"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(item)}
                    className="mt-3 bg-[#d4a373] text-white px-3 py-2 rounded-md text-sm hover:bg-[#c6975e] transition"
                  >
                    Tambah
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
