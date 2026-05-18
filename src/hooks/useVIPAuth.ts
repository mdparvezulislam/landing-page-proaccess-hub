'use client';

import { useState, useEffect, useCallback } from 'react';

interface VIPAuthSession {
  memberId: string;
  accessCode: string;
  membershipId: string;
  userName: string;
  telegramUsername?: string;
  status: string;
}

const STORAGE_KEY = 'vip-auth-session';

export function useVIPAuth() {
  const [session, setSession] = useState<VIPAuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSession(JSON.parse(stored));
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (credential: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/vip/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }
      const newSession: VIPAuthSession = {
        memberId: data.memberId,
        accessCode: data.accessCode,
        membershipId: data.membershipId,
        userName: data.userName,
        telegramUsername: data.telegramUsername,
        status: data.status,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
      setSession(newSession);
      return { success: true };
    } catch {
      return { success: false, error: 'Network error. Please try again.' };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  }, []);

  const saveSession = useCallback((data: { memberId: string; accessCode: string; membershipId: string; userName: string; telegramUsername?: string; status: string }) => {
    const newSession: VIPAuthSession = {
      memberId: data.memberId,
      accessCode: data.accessCode,
      membershipId: data.membershipId,
      userName: data.userName,
      telegramUsername: data.telegramUsername,
      status: data.status,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
    setSession(newSession);
  }, []);

  const getHeaders = useCallback((): Record<string, string> => {
    if (!session) return {};
    return {
      'x-member-id': session.memberId,
      'x-access-code': session.accessCode,
    };
  }, [session]);

  return { session, loading, login, logout, saveSession, getHeaders };
}
