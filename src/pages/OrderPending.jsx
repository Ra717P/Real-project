import { Link } from "react-router-dom";

export default function OrderPending() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfbf7] text-center p-6">
      <h1 className="text-3xl font-bold text-yellow-600 mb-4">
        ⌛ Pembayaran Pending
      </h1>
      <p className="text-gray-700 mb-6">
        Pembayaran kamu masih menunggu. Selesaikan instruksi pembayaran di
        Midtrans.
      </p>
      <Link
        to="/menu"
        className="bg-yellow-500 text-white px-6 py-2 rounded-md hover:bg-yellow-600 transition"
      >
        Kembali ke Menu
      </Link>
    </div>
  );
}
