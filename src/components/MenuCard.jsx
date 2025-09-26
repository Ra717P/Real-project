// src/components/MenuCard.jsx
import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function MenuCard({ id, name, price, image, category }) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-xs h-[380px] flex flex-col justify-between text-center hover:shadow-xl hover:scale-105 transition duration-300">
      <div className="flex-1 flex flex-col items-center">
        <img
          src={image}
          alt={name}
          className="rounded-xl mb-4 w-28 h-28 object-cover"
        />
        <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
        <p className="text-sm text-gray-500">{category}</p>
        <p className="text-base font-medium text-gray-700 mt-2">{price}</p>

        {/* Qty selector */}
        <div className="flex items-center justify-center gap-2 mt-3">
          <button
            onClick={() => setQty((prev) => Math.max(1, prev - 1))}
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            -
          </button>
          <span className="px-3">{qty}</span>
          <button
            onClick={() => setQty((prev) => prev + 1)}
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            +
          </button>
        </div>
      </div>

      {/* Tombol tambah */}
      <button
        onClick={() =>
          addToCart({ id, name, price, image, category, quantity: qty })
        }
        className="mt-auto px-5 py-2 bg-[#e0b882] text-white rounded-lg hover:bg-[#d4a373] transition"
      >
        Tambah ke Keranjang
      </button>
    </div>
  );
}
