import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useVIPPlans = () => {
  return useQuery({
    queryKey: ['vip-plans'],
    queryFn: async () => {
      const res = await fetch('/api/vip/plans');
      if (!res.ok) throw new Error('Failed to fetch VIP plans');
      return res.json();
    },
  });
};

export const useUpdateVIPPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/vip/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to save VIP plan');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vip-plans'] });
      toast.success('VIP Plan saved');
    },
  });
};

export const useDeleteVIPPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/vip/plans/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete VIP plan');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vip-plans'] });
      toast.success('VIP Plan deleted');
    },
  });
};

export const useVIPMembers = () => {
  return useQuery({
    queryKey: ['vip-members'],
    queryFn: async () => {
      const res = await fetch('/api/vip/members');
      if (!res.ok) throw new Error('Failed to fetch VIP members');
      return res.json();
    },
  });
};

export const useUpdateVIPMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await fetch(`/api/vip/members/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update member');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vip-members'] });
      toast.success('Member updated');
    },
  });
};

export const useDeleteVIPMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/vip/members/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete member');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vip-members'] });
      toast.success('Member deleted');
    },
  });
};

export const useBulkDeleteVIPMembers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await fetch('/api/vip/members', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });
      if (!res.ok) throw new Error('Failed to delete members');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vip-members'] });
      toast.success('Selected members deleted');
    },
  });
};

export const useVIPPayments = () => {
  return useQuery({
    queryKey: ['vip-payments'],
    queryFn: async () => {
      const res = await fetch('/api/vip/payments');
      if (!res.ok) throw new Error('Failed to fetch VIP payments');
      return res.json();
    },
  });
};

export const useVerifyVIPPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await fetch(`/api/vip/payments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to verify payment');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vip-payments'] });
      queryClient.invalidateQueries({ queryKey: ['vip-members'] });
    },
  });
};

export const useVIPReminders = () => {
  return useQuery({
    queryKey: ['vip-reminders'],
    queryFn: async () => {
      const res = await fetch('/api/vip/reminders');
      if (!res.ok) throw new Error('Failed to fetch reminders');
      return res.json();
    },
  });
};

export const useCreateVIPReminder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/vip/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create reminder');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vip-reminders'] });
      toast.success('Reminder sent');
    },
  });
};

export const useVIPNotifications = () => {
  return useQuery({
    queryKey: ['vip-notifications'],
    queryFn: async () => {
      const res = await fetch('/api/vip/notifications');
      if (!res.ok) throw new Error('Failed to fetch notifications');
      return res.json();
    },
    refetchInterval: 30000,
  });
};

export const useCreateVIPNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/vip/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create notification');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vip-notifications'] });
      toast.success('Notification created');
    },
  });
};

export const useVIPCheckout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/vip/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Checkout failed');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vip-members'] });
    },
  });
};

export const useVIPStats = () => {
  return useQuery({
    queryKey: ['vip-stats'],
    queryFn: async () => {
      const res = await fetch('/api/vip/stats');
      if (!res.ok) throw new Error('Failed to fetch VIP stats');
      return res.json();
    },
  });
};
