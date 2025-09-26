import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function PaymentResultPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("checking");
  const [details, setDetails] = useState(null);
  const navigate = useNavigate();

  // DANA akan mengirim orderId di query string
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (!orderId) {
      setStatus("failed");
      return;
    }

    const checkStatus = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/order-status/${orderId}`
        );
        const data = await res.json();

        console.log("Payment Result:", data);
        setDetails(data.result || data);

        if (data.result?.orderStatus === "SUCCESS") {
          setStatus("success");
        } else if (data.result?.orderStatus === "PENDING") {
          setStatus("pending");
        } else {
          setStatus("failed");
        }
      } catch (err) {
        console.error("Order status error:", err);
        setStatus("failed");
      }
    };

    checkStatus();
  }, [orderId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfbf7] px-4">
      {status === "checking" && (
        <h1 className="text-2xl font-bold">Memeriksa status pembayaran...</h1>
      )}

      {status === "success" && (
        <div className="text-center">
          <h1 className="text-3xl font-bold text-green-600 mb-4">
            ✅ Pembayaran Berhasil!
          </h1>
          <p className="text-gray-700 mb-6">
            Terima kasih, pesanan Anda sudah kami terima.
          </p>
          <button
            onClick={() => navigate("/menu")}
            className="px-5 py-2 bg-[#d4a373] text-white rounded-lg hover:bg-[#c6975e]"
          >
            Kembali ke Menu
          </button>
        </div>
      )}

      {status === "pending" && (
        <div className="text-center">
          <h1 className="text-2xl font-bold text-yellow-600 mb-4">
            ⏳ Pembayaran Sedang Diproses
          </h1>
          <p className="text-gray-700 mb-6">
            Mohon tunggu beberapa saat hingga transaksi dikonfirmasi.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-5 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
          >
            Kembali
          </button>
        </div>
      )}

      {status === "failed" && (
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            ❌ Pembayaran Gagal
          </h1>
          <p className="text-gray-700 mb-6">
            Mohon coba lagi atau gunakan metode pembayaran lain.
          </p>
          <button
            onClick={() => navigate("/checkout")}
            className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {details && (
        <div className="mt-8 text-sm bg-white shadow-md rounded-lg p-4 w-full max-w-md">
          <h2 className="font-semibold mb-2">Detail Transaksi</h2>
          <pre className="text-left text-xs bg-gray-100 p-2 rounded overflow-x-auto">
            {JSON.stringify(details, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
