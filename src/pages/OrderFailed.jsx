import { Link } from "react-router-dom";

export default function OrderFailed() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfbf7] px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          ❌ Pembayaran Gagal
        </h1>
        <p className="text-gray-600 mb-6">
          Maaf, pembayaran kamu gagal diproses. Silakan coba lagi atau gunakan
          metode pembayaran lain.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/checkout"
            className="px-6 py-2 bg-[#d4a373] text-white rounded-lg hover:bg-[#c6975e] transition"
          >
            Coba Lagi
          </Link>
          <Link
            to="/menu"
            className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
          >
            Kembali ke Menu
          </Link>
        </div>
      </div>
    </div>
  );
}
