import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function BindingResultPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");
  const navigate = useNavigate();

  useEffect(() => {
    const authCode = searchParams.get("authCode");
    if (!authCode) {
      setStatus("failed");
      return;
    }

    const applyToken = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/dana/apply-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ authCode }),
        });

        const data = await res.json();
        console.log("Apply Token Response:", data);

        if (data.accessToken) {
          localStorage.setItem("dana_access_token", data.accessToken);
          setStatus("success");
        } else {
          setStatus("failed");
        }
      } catch (err) {
        console.error("Apply token error:", err);
        setStatus("failed");
      }
    };

    applyToken();
  }, [searchParams]);

  if (status === "loading") return <h1>Memproses binding...</h1>;
  if (status === "failed")
    return <h1 className="text-red-600">❌ Binding gagal</h1>;

  return (
    <div className="text-center mt-20">
      <h1 className="text-green-600 text-2xl font-bold mb-4">
        ✅ Binding Berhasil
      </h1>
      <button
        onClick={() => navigate("/direct-debit")}
        className="px-5 py-2 bg-[#d4a373] text-white rounded-lg hover:bg-[#c6975e]"
      >
        Lanjut ke Pembayaran Direct Debit
      </button>
    </div>
  );
}
