import api from './api';

export const productService = {
  getAll: async () => {
    const response = await api.get('/products');
    return response.data.data as any[];
  },
  
  create: async (product: any) => {
    const response = await api.post('/products', product);
    return response.data.data as any;
  },
  
  update: async (id: string, product: any) => {
    const response = await api.patch(`/products/${id}`, product);
    return response.data.data as any;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  }
};
