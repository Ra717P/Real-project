import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Tambah item ke cart
  const addToCart = (item, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, { ...item, quantity: qty }];
    });
  };

  // ✅ Hapus item dari cart
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // ✅ Kosongkan cart
  const clearCart = () => setCart([]);

  // ✅ Update jumlah item
  const updateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id);
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: newQty } : item
        )
      );
    }
  };

  // ✅ Hitung total harga
  const getTotal = () =>
    cart.reduce((sum, item) => {
      const numericPrice = parseInt(item.price.replace(/[^\d]/g, ""), 10);
      return sum + numericPrice * item.quantity;
    }, 0);

  // ✅ Checkout → panggil backend (server.mjs)
  const checkout = async () => {
    if (cart.length === 0) {
      alert("Keranjang kosong!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: `ORDER-${Date.now()}`,
          items: cart,
        }),
      });

      const data = await res.json();
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl; // ✅ redirect otomatis ke DANA
      } else {
        throw new Error("Backend tidak mengembalikan paymentUrl");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Checkout gagal. Cek console log.");
    } finally {
      setLoading(false);
    }
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
        checkout,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
