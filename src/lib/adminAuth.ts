import { Buffer } from 'buffer';
import { cookies } from 'next/headers';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function base64UrlEncode(buf: Uint8Array): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  let binary = '';
  for (let i = 0; i < buf.length; i++) binary += String.fromCharCode(buf[i]);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecodeToString(b64: string): string {
  let base64 = b64.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) base64 += '=';

  if (typeof Buffer !== 'undefined') {
    return Buffer.from(base64, 'base64').toString('utf8');
  }

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return decoder.decode(bytes);
}

async function hmacSha256(secret: string, message: string): Promise<Uint8Array> {
  const keyData = encoder.encode(secret);
  const msg = encoder.encode(message);

  const cryptoObj = (typeof globalThis !== 'undefined' && (globalThis as any).crypto) || (typeof window !== 'undefined' && window.crypto);
  
  if (cryptoObj?.subtle) {
    const key = await cryptoObj.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const sig = await cryptoObj.subtle.sign('HMAC', key, msg);
    return new Uint8Array(sig);
  }

  // Fallback to Node crypto if subtle is not available (shouldn't happen in modern Next.js/Node)
  const crypto = require('crypto');
  const sig = crypto.createHmac('sha256', secret).update(message).digest();
  return new Uint8Array(sig);
}

export async function createAdminAuthToken(email: string, ttlSeconds = 60 * 60 * 24 * 7): Promise<string> {
  const secret = process.env.JWT_SECRET || 'change_this_super_secret_jwt_key';
  const expiry = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = `${email}.${expiry}`;
  const sigBytes = await hmacSha256(secret, payload);
  const sig = base64UrlEncode(sigBytes);
  const emailB64 = base64UrlEncode(encoder.encode(email));
  return `${emailB64}.${expiry}.${sig}`;
}

export async function verifyAdminAuthToken(token: string): Promise<{ valid: boolean; email: string | null }> {
  if (!token) return { valid: false, email: null };
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return { valid: false, email: null };
    
    const [emailB64, expiryStr, sig] = parts;
    const email = base64UrlDecodeToString(emailB64);
    const expiry = parseInt(expiryStr, 10);
    
    if (isNaN(expiry) || Math.floor(Date.now() / 1000) > expiry) {
      return { valid: false, email: null };
    }
    
    const secret = process.env.JWT_SECRET || 'change_this_super_secret_jwt_key';
    const payload = `${email}.${expiry}`;
    const expectedSigBytes = await hmacSha256(secret, payload);
    const expectedSig = base64UrlEncode(expectedSigBytes);
    
    // Constant time comparison
    if (expectedSig.length !== sig.length) return { valid: false, email: null };
    let result = 0;
    for (let i = 0; i < expectedSig.length; i++) {
      result |= expectedSig.charCodeAt(i) ^ sig.charCodeAt(i);
    }
    
    return { valid: result === 0, email: result === 0 ? email : null };
  } catch (err) {
    console.error('Admin Auth Verification Error:', err);
    return { valid: false, email: null };
  }
}

/**
 * Centralized admin verification helper using Next.js headers/cookies
 */
export async function verifyAdmin(): Promise<{ valid: boolean; email: string | null }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin-auth')?.value;
    
    if (!token) return { valid: false, email: null };
    
    return await verifyAdminAuthToken(token);
  } catch (error) {
    console.error('verifyAdmin Helper Error:', error);
    return { valid: false, email: null };
  }
}
