import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'affiliate_jwt_secret_change_me';
const COOKIE_NAME = 'affiliate-auth';

export interface AffiliateTokenPayload {
  id: string;
  email: string;
  affiliateCode: string;
}

export function createAffiliateToken(payload: AffiliateTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyAffiliateToken(token: string): AffiliateTokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AffiliateTokenPayload;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function verifyAffiliate(): Promise<{ valid: boolean; payload: AffiliateTokenPayload | null }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return { valid: false, payload: null };
    const payload = verifyAffiliateToken(token);
    if (!payload) return { valid: false, payload: null };
    return { valid: true, payload };
  } catch {
    return { valid: false, payload: null };
  }
}

export function setAuthCookie(token: string): Response {
  const response = new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
  response.headers.set('Set-Cookie', `${COOKIE_NAME}=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax; Secure`);
  return response;
}
