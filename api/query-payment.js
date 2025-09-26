// api/query-payment.js
const {
  axios,
  DANA_BASE_URL,
  QUERY_ORDER_PATH,
  readJson,
  generateTimestamp,
  generateExternalId,
  generateSignature,
  makeDanaHeaders,
  validateConfig,
} = require("./_dana");

module.exports = async (req, res) => {
  try {
    validateConfig();

    // Terima POST (body.orderId) — GET dengan ?orderId= kompatibel
    let orderId = "";
    if (req.method === "POST") {
      const bodyIn = await readJson(req);
      orderId = bodyIn.orderId || bodyIn.merchantTransId;
    } else if (req.method === "GET") {
      const url = new URL(req.url, "http://x");
      orderId =
        url.searchParams.get("orderId") ||
        url.searchParams.get("merchantTransId");
    } else {
      res.status(405).json({ success: false, error: "Method Not Allowed" });
      return;
    }

    if (!orderId) {
      res.status(400).json({ success: false, error: "orderId required" });
      return;
    }

    const timestamp = generateTimestamp();
    const externalId = generateExternalId();

    const payload = {
      merchantTransId: orderId,
      merchantId: process.env.MERCHANT_ID,
    };

    const raw = JSON.stringify(payload);
    const signature = generateSignature(
      "POST",
      QUERY_ORDER_PATH,
      raw,
      timestamp
    );
    const headers = makeDanaHeaders({ timestamp, externalId, signature });

    const danaResp = await axios.post(
      `${DANA_BASE_URL}${QUERY_ORDER_PATH}`,
      payload,
      {
        headers,
        timeout: 30000,
        validateStatus: (s) => s < 500,
      }
    );

    res.status(200).json({ success: true, data: danaResp.data });
  } catch (e) {
    console.error("❌ query-payment error:", e);
    res
      .status(e.status || 500)
      .json({ success: false, error: e.message || "Internal Error" });
  }
};
