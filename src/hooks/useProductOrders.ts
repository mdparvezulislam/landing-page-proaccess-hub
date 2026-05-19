import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useProductOrders = () => {
  return useQuery({
    queryKey: ['product-orders'],
    queryFn: async () => {
      const res = await fetch('/api/product-orders');
      if (!res.ok) throw new Error('Failed to fetch product orders');
      return res.json();
    }
  });
};

export const useCreateProductOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/product-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to create product order');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-orders'] });
      toast.success('Product order created');
    }
  });
};

export const useUpdateProductOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const res = await fetch(`/api/product-orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to update product order');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-orders'] });
      toast.success('Product order updated');
    }
  });
};

export const useDeleteProductOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/product-orders/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete product order');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-orders'] });
      toast.success('Product order deleted');
    }
  });
};

export const useBulkDeleteProductOrders = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await fetch('/api/product-orders', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });
      if (!res.ok) throw new Error('Failed to delete product orders');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-orders'] });
      toast.success('Selected orders deleted');
    }
  });
};

export const useBanProductOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, banReason }: { id: string; banReason?: string }) => {
      const res = await fetch(`/api/product-orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ban', banReason }),
      });
      if (!res.ok) throw new Error('Failed to ban product order');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-orders'] });
      toast.success('Order banned');
    }
  });
};
