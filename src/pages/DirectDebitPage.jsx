import { useState } from "react";

export default function DirectDebitPage() {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      const orderId = "DD-" + Date.now();
      const res = await fetch("http://localhost:3000/api/dana/direct-debit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, amount: "15000" }),
      });

      const data = await res.json();
      console.log("Direct Debit Response:", data);

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl; // redirect ke DANA
      } else {
        alert("Gagal membuat pembayaran direct debit.");
      }
    } catch (err) {
      console.error("Direct debit error:", err);
      alert("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfbf7]">
      <h1 className="text-2xl font-bold mb-4">Pembayaran Direct Debit</h1>
      <button
        onClick={handlePay}
        disabled={loading}
        className="px-6 py-3 bg-[#d4a373] text-white rounded-lg hover:bg-[#c6975e]"
      >
        {loading ? "Memproses..." : "Bayar Rp 15.000 dengan DANA"}
      </button>
    </div>
  );
}
