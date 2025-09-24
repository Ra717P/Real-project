import { Link } from "react-router-dom";

export default function OrderSuccess() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfbf7] text-center p-6">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        ✅ Pembayaran Berhasil!
      </h1>
      <p className="text-gray-700 mb-6">
        Terima kasih sudah memesan di{" "}
        <span className="font-dancing">Sisi Kopi</span>. Pesanan kamu sedang
        diproses.
      </p>
      <Link
        to="/menu"
        className="bg-[#d4a373] text-white px-6 py-2 rounded-md hover:bg-[#c6975e] transition"
      >
        Kembali ke Menu
      </Link>
    </div>
  );
}
