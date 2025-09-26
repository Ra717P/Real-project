import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const { cart, clearCart, getTotal } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      const orderId = `ORDER-${Date.now()}`; // orderId unik
      const response = await fetch("http://localhost:3000/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, items: cart }),
      });

      const data = await response.json();
      console.log("📦 Response DANA:", data);

      // cek ada paymentUrl
      const paymentUrl =
        data?.paymentUrl ||
        data?.result?.redirectInfo?.url ||
        data?.result?.webRedirectUrl ||
        data?.result?.checkoutUrl;

      if (paymentUrl) {
        clearCart(); // kosongkan cart setelah buat order
        window.location.href = paymentUrl; // redirect ke DANA
      } else {
        console.error("❌ Tidak ada paymentUrl dalam respons:", data);
        alert("URL pembayaran tidak ditemukan. Silakan coba lagi.");
        navigate("/orderfailed");
      }
    } catch (err) {
      console.error("❌ Checkout error:", err);
      navigate("/orderfailed");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfbf7]">
        <h1 className="text-2xl font-bold mb-4">
          Keranjang kosong, silakan pilih menu dulu
        </h1>
        <button
          onClick={() => navigate("/menu")}
          className="px-5 py-2 bg-[#d4a373] text-white rounded-lg hover:bg-[#c6975e] transition"
        >
          Lihat Menu
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfbf7]">
      <h1 className="text-2xl font-bold mb-4">Checkout Pesanan</h1>

      <div className="bg-white shadow rounded-lg p-6 w-full max-w-md">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex justify-between border-b py-2 text-sm"
          >
            <span>
              {item.name} x {item.quantity}
            </span>
            <span>
              Rp{" "}
              {(
                parseInt(item.price.replace(/[^\d]/g, ""), 10) * item.quantity
              ).toLocaleString("id-ID")}
            </span>
          </div>
        ))}

        <div className="flex justify-between font-bold mt-4">
          <span>Total</span>
          <span>Rp {getTotal().toLocaleString("id-ID")}</span>
        </div>

        <button
          onClick={handlePay}
          disabled={loading}
          className={`w-full mt-6 px-6 py-3 rounded-lg shadow transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#d4a373] text-white hover:bg-[#c6975e]"
          }`}
        >
          {loading ? "Memproses..." : "Bayar dengan DANA"}
        </button>
      </div>
    </div>
  );
}
