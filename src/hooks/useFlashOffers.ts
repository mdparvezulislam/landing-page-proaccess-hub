import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useFlashOffers = () => {
  return useQuery({
    queryKey: ['flash-offers'],
    queryFn: async () => {
      const res = await fetch('/api/flash-offers');
      if (!res.ok) throw new Error('Failed to fetch flash offers');
      return res.json();
    }
  });
};

export const useActiveFlashOffers = () => {
  return useQuery({
    queryKey: ['flash-offers', 'active'],
    queryFn: async () => {
      const res = await fetch('/api/flash-offers/active');
      if (!res.ok) throw new Error('Failed to fetch active offers');
      return res.json();
    },
    refetchInterval: 60000,
  });
};

export const useUpdateFlashOffer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/flash-offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to update flash offer');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flash-offers'] });
      queryClient.invalidateQueries({ queryKey: ['flash-offers', 'active'] });
      toast.success('Flash offer updated');
    }
  });
};

export const useDeleteFlashOffer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/flash-offers/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete flash offer');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flash-offers'] });
      queryClient.invalidateQueries({ queryKey: ['flash-offers', 'active'] });
      toast.success('Flash offer deleted');
    }
  });
};
