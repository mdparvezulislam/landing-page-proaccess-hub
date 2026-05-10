const encoder = new TextEncoder();
const decoder = new TextDecoder();

function base64UrlEncode(buf: Uint8Array) {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  let binary = '';
  for (let i = 0; i < buf.length; i++) binary += String.fromCharCode(buf[i]);
  return (typeof btoa !== 'undefined' ? btoa(binary) : Buffer.from(binary, 'binary').toString('base64'))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecodeToString(b64: string) {
  let base64 = b64.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) base64 += '=';
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(base64, 'base64').toString('utf8');
  }
  const binary = typeof atob !== 'undefined' ? atob(base64) : Buffer.from(base64, 'base64').toString('binary');
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return decoder.decode(bytes);
}

async function hmacSha256(secret: string, message: string): Promise<Uint8Array> {
  const keyData = encoder.encode(secret);
  const msg = encoder.encode(message);
  if (typeof globalThis !== 'undefined' && (globalThis as any).crypto && (globalThis as any).crypto.subtle) {
    const subtle = (globalThis as any).crypto.subtle;
    const key = await subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const sig = await subtle.sign('HMAC', key, msg);
    return new Uint8Array(sig as ArrayBuffer);
  }

  // Node fallback
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const crypto = require('crypto');
  const sig = crypto.createHmac('sha256', secret).update(message).digest();
  return Uint8Array.from(sig);
}

async function createAdminAuthToken(email: string, ttlSeconds = 60 * 60 * 24 * 7) {
  const secret = process.env.JWT_SECRET || 'change_this_super_secret_jwt_key';
  const expiry = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = `${email}.${expiry}`;
  const sigBytes = await hmacSha256(secret, payload);
  const sig = base64UrlEncode(sigBytes);
  const emailB64 = base64UrlEncode(encoder.encode(email));
  return `${emailB64}.${expiry}.${sig}`;
}

async function verifyAdminAuthToken(token: string) {
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
