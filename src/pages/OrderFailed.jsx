import { Link } from "react-router-dom";

export default function OrderFailed() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fff5f5] text-center p-6">
      <h1 className="text-3xl font-bold text-red-600 mb-4">
        ❌ Pembayaran Gagal
      </h1>
      <p className="text-gray-700 mb-6">
        Maaf, pembayaran kamu tidak berhasil. Silakan coba lagi.
      </p>
      <Link
        to="/checkout"
        className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition"
      >
        Coba Lagi
      </Link>
    </div>
  );
}
