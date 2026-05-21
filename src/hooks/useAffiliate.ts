'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

async function fetchJson(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export function useAffiliateMe() {
  return useQuery({
    queryKey: ['affiliate-me'],
    queryFn: () => fetchJson('/api/affiliate/auth/me'),
    retry: false,
    staleTime: 30000,
  });
}

export function useAffiliateLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      fetchJson('/api/affiliate/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['affiliate-me'] });
    },
  });
}

export function useAffiliateRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { fullName: string; email: string; telegramUsername: string; password: string; promotionMethod?: string }) =>
      fetchJson('/api/affiliate/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['affiliate-me'] });
    },
  });
}

export function useAffiliateLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => fetchJson('/api/affiliate/auth/logout', { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['affiliate-me'] });
    },
  });
}

export function useAffiliateDashboard() {
  return useQuery({
    queryKey: ['affiliate-dashboard'],
    queryFn: () => fetchJson('/api/affiliate/dashboard'),
    refetchInterval: 30000,
  });
}

export function useAffiliateWallet() {
  return useQuery({
    queryKey: ['affiliate-wallet'],
    queryFn: () => fetchJson('/api/affiliate/wallet'),
    refetchInterval: 15000,
  });
}

export function useAffiliateReferrals(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['affiliate-referrals', page, limit],
    queryFn: () => fetchJson(`/api/affiliate/referrals?page=${page}&limit=${limit}`),
  });
}

export function useAffiliateWithdrawals() {
  return useQuery({
    queryKey: ['affiliate-withdrawals'],
    queryFn: () => fetchJson('/api/affiliate/withdrawals'),
  });
}

export function useRequestWithdrawal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { amount: number; paymentMethod: string; accountNumber: string; accountHolder: string; currency?: string }) =>
      fetchJson('/api/affiliate/withdrawals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['affiliate-withdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['affiliate-wallet'] });
      queryClient.invalidateQueries({ queryKey: ['affiliate-dashboard'] });
      toast.success('Withdrawal request submitted');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useAffiliateCoupons() {
  return useQuery({
    queryKey: ['affiliate-coupons'],
    queryFn: () => fetchJson('/api/affiliate/coupons'),
  });
}

export function useAffiliateNotifications() {
  return useQuery({
    queryKey: ['affiliate-notifications'],
    queryFn: () => fetchJson('/api/affiliate/notifications'),
    refetchInterval: 30000,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      fetchJson(`/api/affiliate/notifications`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, read: true }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['affiliate-notifications'] });
    },
  });
}

export function useUpdateAffiliateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) =>
      fetchJson('/api/affiliate/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['affiliate-me'] });
      toast.success('Settings updated');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
