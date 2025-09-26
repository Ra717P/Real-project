// api/dana/finish-payment.js
const {
  readJson,
  buildFrontendResultUrl,
  getFinishPayload,
} = require("../_dana");

module.exports = async (req, res) => {
  try {
    let payload = {};
    if (req.method === "POST") {
      payload = await readJson(req);
    } else {
      // GET: parse query
      const url = new URL(req.url, "http://x");
      payload = Object.fromEntries(url.searchParams.entries());
    }

    const p = getFinishPayload(payload);
    console.log(`✅ Finish Payment ${req.method} received:`, p.raw);

    const target = buildFrontendResultUrl({
      orderId: p.orderId,
      status: p.status,
      code: p.resultCode,
    });

    // Redirect 307
    res.statusCode = 307;
    res.setHeader("Location", target);
    res.end();
  } catch (e) {
    console.error("❌ finish-payment error:", e);
    res.status(500).end("Internal Error");
  }
};
