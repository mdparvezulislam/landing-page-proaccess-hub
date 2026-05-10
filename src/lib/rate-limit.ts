import { NextResponse } from 'next/server';

const rateLimitMap = new Map();

export function rateLimit(ip: string, limit: number = 60, windowMs: number = 60 * 1000) {
  const now = Date.now();
  const userData = rateLimitMap.get(ip) || { count: 0, startTime: now };

  if (now - userData.startTime > windowMs) {
    userData.count = 1;
    userData.startTime = now;
  } else {
    userData.count++;
  }

  rateLimitMap.set(ip, userData);

  if (userData.count > limit) {
    return false;
  }

  return true;
}

export function withRateLimit(handler: Function, limit: number = 60) {
  return async (req: Request, ...args: any[]) => {
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    if (!rateLimit(ip as string, limit)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
    return handler(req, ...args);
  };
}
