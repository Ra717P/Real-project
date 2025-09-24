import { useEffect } from "react";

export default function CheckoutPage() {
  const handlePay = () => {
    // Contoh Snap Token (sebenarnya didapat dari backend)
    const snapToken = "REPLACE_WITH_YOUR_SNAP_TOKEN";

    window.snap.pay(snapToken, {
      onSuccess: function () {
        window.location.href = "/ordersuccess";
      },
      onPending: function () {
        window.location.href = "/orderpending";
      },
      onError: function () {
        window.location.href = "/orderfailed";
      },
      onClose: function () {
        alert("Pembayaran ditutup sebelum selesai");
      },
    });
  };

  useEffect(() => {
    if (!window.snap) {
      console.error("Snap.js tidak dimuat, cek Client Key di index.html!");
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfbf7]">
      <h1 className="text-2xl font-bold mb-4">Checkout Pesanan</h1>
      <p className="mb-6">Klik tombol di bawah untuk melanjutkan pembayaran.</p>
      <button
        onClick={handlePay}
        className="bg-[#d4a373] text-white px-6 py-3 rounded-lg shadow hover:bg-[#c6975e] transition"
      >
        Bayar Sekarang
      </button>
    </div>
  );
}
