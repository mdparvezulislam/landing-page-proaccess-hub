import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'en' | 'bn';

interface UIState {
  language: Language;
  setLanguage: (lang: Language) => void;
  isAdmin: boolean;
  setAdminStatus: (status: boolean) => void;
  
  // Runtime state for checkout
  selectedOrderContext: any | null;
  setSelectedOrderContext: (context: any | null) => void;
}

export const useStore = create<UIState>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (lang) => set({ language: lang }),
      isAdmin: false,
      setAdminStatus: (status) => set({ isAdmin: status }),
      
      selectedOrderContext: null,
      setSelectedOrderContext: (context) => set({ selectedOrderContext: context }),
    }),
    {
      name: 'pro-access-hub-ui-state',
    }
  )
);
