import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function PaymentResult() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(null); // 'SUCCESS' | 'FAILED' | 'PENDING' | null
  const [detail, setDetail] = useState(null);

  const orderId = params.get("orderId");
  const hintedStatus = params.get("status"); // 'success' | 'failed' (hint saja)

  useEffect(() => {
    const checkStatus = async () => {
      if (!orderId) {
        setLoading(false);
        setVerified("FAILED");
        return;
      }
      try {
        const resp = await fetch(
          `http://localhost:3000/api/query-payment/${encodeURIComponent(
            orderId
          )}`,
          { method: "GET" }
        );
        const data = await resp.json();
        // Struktur backend: { success: true, data: <response DANA> }
        // Contoh mapping: cari field status/resultCode dari response DANA
        const dana = data?.data;
        const resultCode =
          dana?.responseCode ||
          dana?.result?.resultCode ||
          dana?.result?.code ||
          "";

        // Heuristik status (sesuaikan dengan skema DANA di environment kamu)
        const statusFromDana =
          dana?.result?.status ||
          dana?.status ||
          (resultCode === "0000" ? "SUCCESS" : "FAILED");

        setVerified(statusFromDana);
        setDetail(dana);
      } catch (e) {
        console.error("Query payment error:", e);
        setVerified("FAILED");
      } finally {
        setLoading(false);
      }
    };
    checkStatus();
  }, [orderId]);

  const isSuccess = String(verified).toUpperCase() === "SUCCESS";

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfbf7]">
        <div className="animate-pulse text-lg">Memverifikasi pembayaran…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfbf7] px-4">
      <div className="bg-white shadow rounded-2xl p-8 w-full max-w-md text-center">
        {isSuccess ? (
          <>
            <h1 className="text-2xl font-bold text-green-600">
              Pembayaran Berhasil 🎉
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Order ID: <span className="font-mono">{orderId}</span>
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-red-600">
              Pembayaran Gagal
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Order ID: <span className="font-mono">{orderId || "-"}</span>
            </p>
            {hintedStatus && (
              <p className="mt-1 text-xs text-gray-500">
                Hint dari redirect: {hintedStatus}
              </p>
            )}
          </>
        )}

        <div className="mt-6 text-left text-xs bg-gray-50 p-4 rounded-lg overflow-auto max-h-56">
          <pre className="whitespace-pre-wrap break-all">
            {JSON.stringify(detail, null, 2)}
          </pre>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate("/menu")}
            className="px-4 py-2 rounded-lg bg-[#d4a373] text-white hover:bg-[#c6975e] transition"
          >
            Kembali ke Menu
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
          >
            Beranda
          </button>
        </div>
      </div>
    </div>
  );
}
