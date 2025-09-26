// api/callback.js
const { readJson } = require("./_dana");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const body = await readJson(req);
    console.log("📞 Callback received:", body);

    // TODO (opsional): verifikasi signature dari DANA lalu update DB status order
    // Contoh response standar DANA:
    res.status(200).json({ responseCode: "0000", responseMessage: "Success" });
  } catch (e) {
    console.error("❌ callback error:", e);
    res
      .status(500)
      .json({
        responseCode: "9999",
        responseMessage: e.message || "Internal Error",
      });
  }
};
