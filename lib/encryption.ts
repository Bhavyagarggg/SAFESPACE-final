import { getSupabaseClient } from "./supabase";

const algorithm = { name: "AES-GCM", ivLength: 12 }; // GCM recommended for authenticity
const encoder = new TextEncoder();
const decoder = new TextDecoder();

let encryptionKey: CryptoKey | null = null;

async function getEncryptionKey(): Promise<CryptoKey> {
  if (encryptionKey) {
    return encryptionKey;
  }

  const base64Key = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
  if (!base64Key) {
    throw new Error("NEXT_PUBLIC_ENCRYPTION_KEY is not defined in environment variables.");
  }

  const keyBuffer = Uint8Array.from(atob(base64Key), (c) => c.charCodeAt(0));
  encryptionKey = await crypto.subtle.importKey(
    "raw",
    keyBuffer,
    algorithm,
    true,
    ["encrypt", "decrypt"]
  );
  return encryptionKey;
}

export async function encrypt(data: string | ArrayBuffer): Promise<string | ArrayBuffer> {
  const key = await getEncryptionKey();
  const iv = crypto.getRandomValues(new Uint8Array(algorithm.ivLength));

  let dataBuffer: ArrayBuffer;
  if (typeof data === "string") {
    dataBuffer = encoder.encode(data);
  } else {
    dataBuffer = data;
  }

  const encrypted = await crypto.subtle.encrypt(
    { name: algorithm.name, iv: iv },
    key,
    dataBuffer
  );

  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encrypted), iv.length);

  // Return base64 for strings, ArrayBuffer for files
  return typeof data === "string" ? btoa(String.fromCharCode(...combined)) : combined.buffer;
}

export async function decrypt(encryptedData: string | ArrayBuffer): Promise<string | ArrayBuffer> {
  const key = await getEncryptionKey();

  let combined: Uint8Array;
  if (typeof encryptedData === "string") {
    combined = Uint8Array.from(atob(encryptedData), (c) => c.charCodeAt(0));
  } else {
    combined = new Uint8Array(encryptedData);
  }
  
  const iv = combined.slice(0, algorithm.ivLength);
  const dataBuffer = combined.slice(algorithm.ivLength);

  const decrypted = await crypto.subtle.decrypt(
    { name: algorithm.name, iv: iv },
    key,
    dataBuffer
  );

  // Return string for text, ArrayBuffer for files
  return typeof encryptedData === "string" ? decoder.decode(decrypted) : decrypted;
}

// Function to generate a new key (for initial setup or rotation)
export async function generateKey(): Promise<string> {
  const key = await crypto.subtle.generateKey(
    {
      name: algorithm.name,
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
  const exportedKey = await crypto.subtle.exportKey("raw", key);
  return btoa(String.fromCharCode(...new Uint8Array(exportedKey)));
} 