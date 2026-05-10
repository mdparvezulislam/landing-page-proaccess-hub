import axios from 'axios';

const api = axios.create({
  baseURL: '/api/faqs',
});

export const faqService = {
  getAll: async () => {
    const response = await api.get('/');
    return response.data;
  },
  create: (data: any) => api.post('/', data),
  update: (id: string, data: any) => api.patch(`/${id}`, data),
  delete: (id: string) => api.delete(`/${id}`),
};
