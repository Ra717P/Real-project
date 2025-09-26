const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");
const crypto = require("crypto");
const fs = require("fs");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // <— penting utk callback/redirect urlencoded
app.use(cors());

// === Load Private Key ===
let PRIVATE_KEY;
if (process.env.PRIVATE_KEY_PATH) {
  PRIVATE_KEY = fs.readFileSync(process.env.PRIVATE_KEY_PATH, "utf8");
} else {
  PRIVATE_KEY = process.env.PRIVATE_KEY;
}

// === DANA API Configuration ===
const DANA_BASE_URL =
  process.env.DANA_BASE_URL || "https://api.sandbox.dana.id";
const CREATE_ORDER_PATH =
  "/dana/sandbox/expand/v1.0/payment/payment-host-to-host.htm";
const QUERY_ORDER_PATH = "/dana/sandbox/expand/v1.0/payment/query.htm";

// === Helpers URL ===
function normalizeBase(url, fallback) {
  const raw = (url || fallback || "").trim();
  if (!raw) return "";
  try {
    const u = new URL(raw);
    return u.origin; // buang path apapun
  } catch {
    return raw.replace(/\/+$/, "");
  }
}

function buildCallbackUrl() {
  // PRIORITAS:
  // 1) CALLBACK_URL (kalau ada, pastikan dipaksa ke /api/callback)
  // 2) BACKEND_BASE_URL + /api/callback
  const fromEnv = process.env.CALLBACK_URL;
  const backendBase = normalizeBase(
    process.env.BACKEND_BASE_URL,
    "http://localhost:3000"
  );

  if (fromEnv) {
    try {
      const u = new URL(fromEnv);
      u.pathname = "/api/callback";
      return u.toString().replace(/\/$/, "");
    } catch {
      return `${fromEnv.replace(/\/+$/, "")}/api/callback`;
    }
  }
  return `${backendBase}/api/callback`;
}

function buildFrontendOrigin() {
  return (
    normalizeBase(
      process.env.FRONTEND_BASE_URL,
      normalizeBase(process.env.DANA_ORIGIN, "http://localhost:5173")
    ) || "http://localhost:5173"
  );
}

function buildFrontendResultUrl(params = {}) {
  const base =
    normalizeBase(process.env.FRONTEND_BASE_URL, "http://localhost:5173") ||
    "http://localhost:5173";
  const path = (process.env.FRONTEND_RESULT_PATH || "/payment-result").replace(
    /\/?$/,
    ""
  );
  const q = new URLSearchParams(params).toString();
  return `${base}${path}?${q}`;
}

// === Utility Functions ===
function generateTimestamp() {
  const now = new Date();
  const pad = (n) => (n < 10 ? "0" + n : n);
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(
    now.getSeconds()
  )}+07:00`;
}

function generateExternalId() {
  return `EXT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function sha256Hash(data) {
  return crypto.createHash("sha256").update(data, "utf8").digest("hex");
}

function generateSignature(httpMethod, uriPath, requestBody, timestamp) {
  const bodyHash = sha256Hash(requestBody);
  const stringToSign = `${httpMethod}:${uriPath}:${bodyHash}:${timestamp}`;
  console.log("🔐 StringToSign:", stringToSign);

  const signer = crypto.createSign("RSA-SHA256");
  signer.update(stringToSign, "utf8");
  return signer.sign(PRIVATE_KEY, "base64");
}

function validateConfig() {
  const required = [
    "MERCHANT_ID",
    "X_PARTNER_ID",
    "CLIENT_SECRET",
    "CLIENT_ID",
    "CHANNEL_ID",
  ];

  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
  if (!PRIVATE_KEY) {
    throw new Error("Missing PRIVATE_KEY / PRIVATE_KEY_PATH");
  }
  console.log("✅ Environment validated");
}

// === Create Payment Order ===
app.post("/api/create-payment", async (req, res) => {
  try {
    validateConfig();

    const { orderId, items = [], customerInfo } = req.body;
    if (items.length === 0) {
      return res.status(400).json({ success: false, error: "Items required" });
    }

    const totalAmount = items.reduce((t, i) => {
      const price =
        typeof i.price === "string"
          ? parseInt(i.price.replace(/[^\d]/g, ""), 10)
          : i.price;
      return t + price * i.quantity;
    }, 0);

    const timestamp = generateTimestamp();
    const merchantTransId = orderId || `ORDER-${Date.now()}`;
    const externalId = generateExternalId();

    const callbackUrl = buildCallbackUrl();
    const frontendOrigin = buildFrontendOrigin();

    const payload = {
      merchantTransId,
      merchantId: process.env.MERCHANT_ID,
      amount: { currency: "IDR", value: totalAmount.toString() },
      productCode: "51051000100000000001",
      envInfo: {
        terminalType: "SYSTEM",
        osType: "LINUX",
        deviceId: `DEVICE-${Date.now()}`,
      },
      callbackUrl, // <-- PASTI KE /api/callback
      orderTitle: `Payment Order ${merchantTransId}`,
      ...(customerInfo && {
        buyerId: customerInfo.userId || `USER-${Date.now()}`,
        buyerEmail: customerInfo.email,
        buyerPhoneNo: customerInfo.phone,
      }),
      extendInfo: JSON.stringify({
        goodsType: "VIRTUAL_GOODS",
        isShowResultPage: "true",
        merchantOrigin: frontendOrigin, // <-- origin FE (5173 saat dev)
        items: items.map((i, idx) => ({
          id: i.id || `ITEM-${idx + 1}`,
          name: i.name,
          price:
            typeof i.price === "string"
              ? parseInt(i.price.replace(/[^\d]/g, ""), 10)
              : i.price,
          quantity: i.quantity,
        })),
      }),
    };

    console.log("🌐 callbackUrl:", callbackUrl);
    console.log("🌐 merchantOrigin:", frontendOrigin);

    const body = JSON.stringify(payload);
    const signature = generateSignature(
      "POST",
      CREATE_ORDER_PATH,
      body,
      timestamp
    );

    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-TIMESTAMP": timestamp,
      "X-PARTNER-ID": process.env.X_PARTNER_ID,
      "X-EXTERNAL-ID": externalId,
      "X-SIGNATURE": signature,
      "CHANNEL-ID": process.env.CHANNEL_ID,
      "X-CLIENT-KEY": process.env.CLIENT_ID,
      Authorization: `Bearer ${process.env.CLIENT_SECRET}`,
      "Request-Id": `REQ-${Date.now()}`,
      "User-Agent": "DANA-Merchant-SDK/1.0",
    };

    console.log("🚀 Sending Create Payment:", payload);
    const response = await axios.post(
      `${DANA_BASE_URL}${CREATE_ORDER_PATH}`,
      payload,
      {
        headers,
        timeout: 60000,
        validateStatus: (s) => s < 500,
      }
    );

    console.log("📥 DANA Response:", response.status, response.data);

    if (response.status === 200 || response.status === 201) {
      return res.json({
        success: true,
        data: response.data,
        orderId: merchantTransId,
        externalId,
      });
    } else {
      return res.status(response.status).json({
        success: false,
        error: "DANA API Error",
        details: response.data,
      });
    }
  } catch (e) {
    console.error("❌ Create Payment Error:", e.message);
    res.status(500).json({ success: false, error: e.message });
  }
});

// === Query Payment ===
app.get("/api/query-payment/:orderId", async (req, res) => {
  try {
    validateConfig();
    const { orderId } = req.params;
    const timestamp = generateTimestamp();
    const externalId = generateExternalId();

    const payload = {
      merchantTransId: orderId,
      merchantId: process.env.MERCHANT_ID,
    };

    const body = JSON.stringify(payload);
    const signature = generateSignature(
      "POST",
      QUERY_ORDER_PATH,
      body,
      timestamp
    );

    const headers = {
      "Content-Type": "application/json",
      "X-TIMESTAMP": timestamp,
      "X-PARTNER-ID": process.env.X_PARTNER_ID,
      "X-EXTERNAL-ID": externalId,
      "X-SIGNATURE": signature,
      "CHANNEL-ID": process.env.CHANNEL_ID,
      "X-CLIENT-KEY": process.env.CLIENT_ID,
      Authorization: `Bearer ${process.env.CLIENT_SECRET}`,
    };

    const response = await axios.post(
      `${DANA_BASE_URL}${QUERY_ORDER_PATH}`,
      payload,
      {
        headers,
        timeout: 30000,
        validateStatus: (s) => s < 500,
      }
    );

    res.json({ success: true, data: response.data });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// === Callback (server-to-server) ===
app.post("/api/callback", (req, res) => {
  console.log("📞 Callback received:", req.body);
  // TODO: verifikasi signature & update DB status order di sini
  res.json({ responseCode: "0000", responseMessage: "Success" });
});

// === Finish Payment (redirect / user landing) ===
function getFinishPayload(req) {
  const src = Object.keys(req.body || {}).length ? req.body : req.query || {};
  const {
    merchantTransId,
    merchantOrderId,
    orderId,
    txnId,
    resultCode,
    resultMsg,
    status,
  } = src;

  const normalizedOrderId =
    merchantTransId || merchantOrderId || orderId || src?.merchantTransId;

  const isOk =
    (status && String(status).toUpperCase() === "SUCCESS") ||
    resultCode === "0000";

  return {
    orderId: normalizedOrderId || "",
    resultCode: resultCode || "",
    resultMsg: resultMsg || "",
    status: isOk ? "success" : "failed",
    raw: src,
  };
}

app.post("/api/dana/finish-payment", (req, res) => {
  const p = getFinishPayload(req);
  console.log("✅ Finish Payment POST received:", p.raw);
  const target = buildFrontendResultUrl({
    orderId: p.orderId,
    status: p.status,
    code: p.resultCode,
  });
  return res.redirect(target);
});

app.get("/api/dana/finish-payment", (req, res) => {
  const p = getFinishPayload(req);
  console.log("✅ Finish Payment GET received:", p.raw);
  const target = buildFrontendResultUrl({
    orderId: p.orderId,
    status: p.status,
    code: p.resultCode,
  });
  return res.redirect(target);
});

// === Health Check ===
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "DANA Payment Service",
  });
});

// === Start Server ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ DANA Payment Server running at http://localhost:${PORT}`);
});
