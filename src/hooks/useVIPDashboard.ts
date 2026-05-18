import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

function getVIPHeaders(): Record<string, string> {
  try {
    const stored = localStorage.getItem('vip-auth-session');
    if (!stored) return {};
    const session = JSON.parse(stored);
    return {
      'x-member-id': session.memberId,
      'x-access-code': session.accessCode,
    };
  } catch {
    return {};
  }
}

export function useUserMembership() {
  return useQuery({
    queryKey: ['user-membership'],
    queryFn: async () => {
      const headers = getVIPHeaders();
      if (!headers['x-member-id']) throw new Error('Not authenticated');
      const res = await fetch('/api/vip/user/membership', { headers });
      if (!res.ok) throw new Error('Failed to fetch membership');
      return res.json();
    },
    retry: false,
  });
}

export function useUserPayments() {
  return useQuery({
    queryKey: ['user-payments'],
    queryFn: async () => {
      const headers = getVIPHeaders();
      if (!headers['x-member-id']) throw new Error('Not authenticated');
      const res = await fetch('/api/vip/user/payments', { headers });
      if (!res.ok) throw new Error('Failed to fetch payments');
      return res.json();
    },
    retry: false,
  });
}

export function useUserNotifications() {
  return useQuery({
    queryKey: ['user-notifications'],
    queryFn: async () => {
      const headers = getVIPHeaders();
      if (!headers['x-member-id']) throw new Error('Not authenticated');
      const res = await fetch('/api/vip/user/notifications', { headers });
      if (!res.ok) throw new Error('Failed to fetch notifications');
      return res.json();
    },
    retry: false,
    refetchInterval: 30000,
  });
}

export function useMarkNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId?: string) => {
      const headers = getVIPHeaders();
      const res = await fetch('/api/vip/user/notifications', {
        method: 'PATCH',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: notificationId || null, read: true }),
      });
      if (!res.ok) throw new Error('Failed to mark read');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-notifications'] });
    },
  });
}

export function useSubmitPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { amountBDT: number; amountUSDT?: number; paymentMethod: string; transactionId: string; screenshot?: string; note?: string }) => {
      const headers = getVIPHeaders();
      const res = await fetch('/api/vip/user/submit-payment', {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Payment submission failed');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-payments'] });
      queryClient.invalidateQueries({ queryKey: ['user-membership'] });
      queryClient.invalidateQueries({ queryKey: ['user-notifications'] });
      toast.success('Payment submitted for verification');
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}
