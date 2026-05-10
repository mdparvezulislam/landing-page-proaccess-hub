import { Buffer } from 'buffer';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function base64UrlEncode(buf: Uint8Array): string {
  // Prefer Node Buffer when available for reliable base64
  if (typeof Buffer !== 'undefined' && typeof Buffer.from === 'function') {
    return Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  // Browser fallback using btoa
  let binary = '';
  for (let i = 0; i < buf.length; i++) binary += String.fromCharCode(buf[i]);
  if (typeof btoa !== 'undefined') {
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  throw new Error('No base64 encoder available');
}

function base64UrlDecodeToString(b64: string): string {
  let base64 = b64.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) base64 += '=';

  if (typeof Buffer !== 'undefined' && typeof Buffer.from === 'function') {
    return Buffer.from(base64, 'base64').toString('utf8');
  }

  if (typeof atob !== 'undefined') {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return decoder.decode(bytes);
  }

  throw new Error('No base64 decoder available');
}

async function hmacSha256(secret: string, message: string): Promise<Uint8Array> {
  const keyData = encoder.encode(secret);
  const msg = encoder.encode(message);

  // Use Web Crypto API when available (Edge/middleware safe)
  if (typeof globalThis !== 'undefined' && (globalThis as any).crypto && (globalThis as any).crypto.subtle) {
    const subtle = (globalThis as any).crypto.subtle;
    const key = await subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const sig = await subtle.sign('HMAC', key, msg);
    return new Uint8Array(sig as ArrayBuffer);
  }

  // Node fallback using built-in crypto
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const crypto = require('crypto');
  const sig: Buffer = crypto.createHmac('sha256', secret).update(message).digest();
  return new Uint8Array(sig);
}

async function createAdminAuthToken(email: string, ttlSeconds = 60 * 60 * 24 * 7): Promise<string> {
  const secret = process.env.JWT_SECRET || 'change_this_super_secret_jwt_key';
  const expiry = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = `${email}.${expiry}`;
  const sigBytes = await hmacSha256(secret, payload);
  const sig = base64UrlEncode(sigBytes);
  const emailB64 = base64UrlEncode(encoder.encode(email));
  return `${emailB64}.${expiry}.${sig}`;
}

async function verifyAdminAuthToken(token: string): Promise<{ valid: boolean; email: string | null }> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return { valid: false, email: null };
    const [emailB64, expiryStr, sig] = parts;
    const email = base64UrlDecodeToString(emailB64);
    const expiry = parseInt(expiryStr, 10);
    if (isNaN(expiry) || Math.floor(Date.now() / 1000) > expiry) return { valid: false, email: null };
    const secret = process.env.JWT_SECRET || 'change_this_super_secret_jwt_key';
    const payload = `${email}.${expiry}`;
    const expectedSigBytes = await hmacSha256(secret, payload);
    const expectedSig = base64UrlEncode(expectedSigBytes);
    if (expectedSig.length !== sig.length) return { valid: false, email: null };
    let result = 0;
    for (let i = 0; i < expectedSig.length; i++) result |= expectedSig.charCodeAt(i) ^ sig.charCodeAt(i);
    if (result !== 0) return { valid: false, email: null };
    return { valid: true, email };
  } catch (err) {
    return { valid: false, email: null };
  }
}

export { createAdminAuthToken, verifyAdminAuthToken };
