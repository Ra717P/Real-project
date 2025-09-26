import { generateKeyPairSync } from "crypto";
import fs from "fs";

// Generate RSA keypair 2048 bit
const { privateKey, publicKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: "spki",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem",
  },
});

// Pastikan folder keys ada
if (!fs.existsSync("./keys")) {
  fs.mkdirSync("./keys");
}

// Simpan ke file
fs.writeFileSync("./keys/private_key.pem", privateKey);
fs.writeFileSync("./keys/public_key.pem", publicKey);

console.log("✅ RSA keypair generated in ./keys/");
