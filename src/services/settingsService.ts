import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const settingsService = {
  // Global Settings (Full Object)
  getGlobal: async () => {
    const response = await api.get('/settings');
    return response.data;
  },
  updateGlobal: async (data: any) => {
    const response = await api.post('/settings', data);
    return response.data;
  },

  // Granular Section Updates
  updateHero: (data: any) => api.post('/hero', data),
  updateSite: (data: any) => api.post('/site-settings', data),
  updateNavbar: (data: any) => api.post('/navbar', data),
  updateFooter: (data: any) => api.post('/footer', data),
  updateCountdown: (data: any) => api.post('/countdown', data),
  updatePayment: (data: any) => api.post('/payment-settings', data),
  updateTrustBadges: (data: any) => api.post('/trust-badges', data),
  updateGlobalFeatures: (data: any) => api.post('/global-features', data),
};
