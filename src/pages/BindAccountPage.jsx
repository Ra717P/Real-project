import { useState } from "react";

export default function BindAccountPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBind = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/dana/bind-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await res.json();
      if (data.deeplinkUrl) {
        window.location.href = data.deeplinkUrl; // redirect ke DANA
      } else {
        alert("Gagal mendapatkan deeplink.");
      }
    } catch (err) {
      console.error("Bind error:", err);
      alert("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfbf7]">
      <h1 className="text-2xl font-bold mb-4">Bind Akun DANA</h1>
      <input
        type="text"
        placeholder="Nomor HP DANA"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="border rounded px-4 py-2 mb-4 w-64"
      />
      <button
        onClick={handleBind}
        disabled={loading}
        className="px-6 py-3 bg-[#d4a373] text-white rounded-lg hover:bg-[#c6975e]"
      >
        {loading ? "Memproses..." : "Bind Akun"}
      </button>
    </div>
  );
}
