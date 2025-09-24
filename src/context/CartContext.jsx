// src/context/CartContext.jsx
import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // ✅ Tambah item ke cart
  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + (item.quantity || 1) }
            : i
        );
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });
  };

  // ✅ Hapus item dari cart
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // ✅ Kosongkan cart
  const clearCart = () => setCart([]);

  // ✅ Update jumlah item (misal di halaman cart dengan + / - button)
  const updateQuantity = (id, newQty) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, newQty) } // minimal 1
          : item
      )
    );
  };

  // ✅ Hitung total harga cart (otomatis siap dipakai di CheckoutPage)
  const getTotal = () => {
    return cart.reduce((sum, item) => {
      const numericPrice = parseInt(item.price.replace(/[^\d]/g, ""), 10);
      return sum + numericPrice * item.quantity;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        getTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
