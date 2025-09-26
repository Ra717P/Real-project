// api/create-payment.js
const {
  axios,
  DANA_BASE_URL,
  CREATE_ORDER_PATH,
  readJson,
  generateTimestamp,
  generateExternalId,
  generateSignature,
  makeDanaHeaders,
  validateConfig,
  buildCallbackUrl,
  buildFrontendOrigin,
} = require("./_dana");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ success: false, error: "Method Not Allowed" });
    return;
  }

  try {
    validateConfig();

    const bodyIn = await readJson(req);
    const { orderId, items = [], customerInfo } = bodyIn;

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ success: false, error: "Items required" });
      return;
    }

    const totalAmount = items.reduce((t, i) => {
      const price =
        typeof i.price === "string"
          ? parseInt(String(i.price).replace(/[^\d]/g, ""), 10)
          : i.price;
      return t + (price || 0) * (i.quantity || 1);
    }, 0);

    const timestamp = generateTimestamp();
    const merchantTransId = orderId || `ORDER-${Date.now()}`;
    const externalId = generateExternalId();
    const callbackUrl = buildCallbackUrl();
    const frontendOrigin = buildFrontendOrigin();

    const payload = {
      merchantTransId,
      merchantId: process.env.MERCHANT_ID,
      amount: { currency: "IDR", value: String(totalAmount) },
      productCode: "51051000100000000001",
      envInfo: {
        terminalType: "SYSTEM",
        osType: "LINUX",
        deviceId: `DEVICE-${Date.now()}`,
      },
      callbackUrl,
      orderTitle: `Payment Order ${merchantTransId}`,
      ...(customerInfo && {
        buyerId: customerInfo.userId || `USER-${Date.now()}`,
        buyerEmail: customerInfo.email,
        buyerPhoneNo: customerInfo.phone,
      }),
      extendInfo: JSON.stringify({
        goodsType: "VIRTUAL_GOODS",
        isShowResultPage: "true",
        merchantOrigin: frontendOrigin,
        items: items.map((i, idx) => ({
          id: i.id || `ITEM-${idx + 1}`,
          name: i.name,
          price:
            typeof i.price === "string"
              ? parseInt(String(i.price).replace(/[^\d]/g, ""), 10)
              : i.price,
          quantity: i.quantity,
        })),
      }),
    };

    const raw = JSON.stringify(payload);
    const signature = generateSignature(
      "POST",
      CREATE_ORDER_PATH,
      raw,
      timestamp
    );
    const headers = makeDanaHeaders({ timestamp, externalId, signature });

    console.log("🌐 callbackUrl:", callbackUrl);
    console.log("🌐 merchantOrigin:", frontendOrigin);
    console.log("🚀 Sending Create Payment:", payload);

    const danaResp = await axios.post(
      `${DANA_BASE_URL}${CREATE_ORDER_PATH}`,
      payload,
      {
        headers,
        timeout: 60000,
        validateStatus: (s) => s < 500,
      }
    );

    console.log("📥 DANA Response:", danaResp.status, danaResp.data);

    if (danaResp.status === 200 || danaResp.status === 201) {
      res.status(200).json({
        success: true,
        data: danaResp.data,
        orderId: merchantTransId,
        externalId,
      });
    } else {
      res.status(danaResp.status).json({
        success: false,
        error: "DANA API Error",
        details: danaResp.data,
      });
    }
  } catch (e) {
    console.error("❌ create-payment error:", e);
    res
      .status(e.status || 500)
      .json({ success: false, error: e.message || "Internal Error" });
  }
};
