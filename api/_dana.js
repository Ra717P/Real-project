// api/_dana.js
const crypto = require("crypto");
const axios = require("axios");
const qs = require("querystring");

// === ENV & CONST ===
const DANA_BASE_URL =
  process.env.DANA_BASE_URL || "https://api.sandbox.dana.id";
const CREATE_ORDER_PATH =
  "/dana/sandbox/expand/v1.0/payment/payment-host-to-host.htm";
const QUERY_ORDER_PATH = "/dana/sandbox/expand/v1.0/payment/query.htm";

function normalizeBase(url, fallback) {
  const raw = (url || fallback || "").trim();
  if (!raw) return "";
  try {
    const u = new URL(raw);
    return u.origin; // buang path
  } catch {
    return raw.replace(/\/+$/, "");
  }
}

function buildCallbackUrl() {
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

// === Body parsing untuk Node serverless ===
async function readJson(req) {
  // Jika framework sudah parse (Next API), gunakan itu
  if (
    req.body &&
    typeof req.body === "object" &&
    Object.keys(req.body).length > 0
  )
    return req.body;

  const raw = await new Promise((resolve) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => resolve(data));
  });
  const ct = (req.headers["content-type"] || "").toLowerCase();

  if (ct.includes("application/json")) {
    try {
      return JSON.parse(raw || "{}");
    } catch {
      return {};
    }
  }
  if (ct.includes("application/x-www-form-urlencoded")) {
    return qs.parse(raw);
  }
  // coba JSON best-effort
  try {
    return JSON.parse(raw || "{}");
  } catch {
    return {};
  }
}

// === Utilities ===
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
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(stringToSign, "utf8");
  const key = (process.env.PRIVATE_KEY || "").replace(/\\n/g, "\n");
  return signer.sign(key, "base64");
}

function validateConfig() {
  const required = [
    "MERCHANT_ID",
    "X_PARTNER_ID",
    "CLIENT_SECRET",
    "CLIENT_ID",
    "CHANNEL_ID",
    "PRIVATE_KEY",
  ];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    const err = new Error(`Missing required envs: ${missing.join(", ")}`);
    err.status = 500;
    throw err;
  }
}

function makeDanaHeaders({ timestamp, externalId, signature }) {
  return {
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
}

function getFinishPayload(obj) {
  const src = obj || {};
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

module.exports = {
  axios,
  DANA_BASE_URL,
  CREATE_ORDER_PATH,
  QUERY_ORDER_PATH,
  readJson,
  generateTimestamp,
  generateExternalId,
  generateSignature,
  makeDanaHeaders,
  validateConfig,
  buildCallbackUrl,
  buildFrontendOrigin,
  buildFrontendResultUrl,
  getFinishPayload,
};
