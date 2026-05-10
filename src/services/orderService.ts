import axios from 'axios';

const api = axios.create({
  baseURL: '/api/orders',
});

export const orderService = {
  getAll: async () => {
    const response = await api.get('/');
    return response.data;
  },
  create: (data: any) => api.post('/', data),
  updateStatus: (id: string, status: string) => api.patch(`/${id}`, { status }),
  delete: (id: string) => api.delete(`/${id}`),
};
