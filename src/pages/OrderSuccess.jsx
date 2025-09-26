import { Link } from "react-router-dom";

export default function OrderSuccess() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfbf7] px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">
          ✅ Pembayaran Berhasil!
        </h1>
        <p className="text-gray-600 mb-6">
          Terima kasih telah melakukan pemesanan. Pesanan kamu sedang diproses.
        </p>
        <Link
          to="/menu"
          className="px-6 py-2 bg-[#d4a373] text-white rounded-lg hover:bg-[#c6975e] transition"
        >
          Kembali ke Menu
        </Link>
      </div>
    </div>
  );
}
