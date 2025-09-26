// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { cart } = useCart();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-gray-100 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo */}
        <h1 className="font-dancing text-2xl text-gray-800">Sisi Kopi</h1>

        {/* Menu */}
        <div className="flex items-center gap-4 text-sm sm:text-base">
          <Link to="/" className="hover:text-[#d4a373] transition">
            Home
          </Link>
          <Link to="/menu" className="hover:text-[#d4a373] transition">
            Menu
          </Link>
          <Link to="/about" className="hover:text-[#d4a373] transition">
            About
          </Link>
          <Link to="/contact" className="hover:text-[#d4a373] transition">
            Contact
          </Link>

          {/* Tombol Cart dengan counter */}
          <Link
            to="/cart"
            className="bg-[#d4a373] text-white px-4 py-2 rounded-md hover:bg-[#c6975e] transition"
          >
            Cart ({totalItems})
          </Link>
        </div>
      </div>
    </nav>
  );
}
