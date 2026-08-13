// File encryption - ensures even if someone clones repo or gets storage, they can't read files without key
import crypto from "crypto";
import fs from "fs";

const ALGO = "aes-256-gcm";

function getKey(): Buffer {
  const hex = process.env.FILE_ENCRYPTION_KEY;
  if (!hex) throw new Error("FILE_ENCRYPTION_KEY not set");
  if (hex.length !== 64) throw new Error("FILE_ENCRYPTION_KEY must be 64 hex chars (32 bytes)");
  return Buffer.from(hex, "hex");
}

export function encryptFile(inputPath: string, outputPath: string) {
  const key = getKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  
  const input = fs.readFileSync(inputPath);
  const encrypted = Buffer.concat([cipher.update(input), cipher.final()]);
  const authTag = cipher.getAuthTag();
  
  // Store as [iv(12)][authTag(16)][encryptedData]
  const combined = Buffer.concat([iv, authTag, encrypted]);
  fs.writeFileSync(outputPath, combined);
  return outputPath;
}

export function decryptFile(inputPath: string, outputPath: string) {
  const key = getKey();
  const data = fs.readFileSync(inputPath);
  
  const iv = data.subarray(0, 12);
  const authTag = data.subarray(12, 28);
  const encrypted = data.subarray(28);
  
  const decipher = crypto.createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(authTag);
  
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  fs.writeFileSync(outputPath, decrypted);
  return outputPath;
}

export function encryptBuffer(buffer: Buffer): { encrypted: Buffer; iv: string; authTag: string } {
  const key = getKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  return {
    encrypted,
    iv: iv.toString("hex"),
    authTag: cipher.getAuthTag().toString("hex"),
  };
}
