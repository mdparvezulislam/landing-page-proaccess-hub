import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CurrencyState {
  currentCurrency: 'BDT' | 'USDT';
  usdtRate: number;
  toggleCurrency: () => void;
  setCurrency: (currency: 'BDT' | 'USDT') => void;
  setUsdtRate: (rate: number) => void;
  convertPrice: (priceTk: number) => { amount: number; currency: string };
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      currentCurrency: 'BDT',
      usdtRate: 125,
      toggleCurrency: () => set((state) => ({ 
        currentCurrency: state.currentCurrency === 'BDT' ? 'USDT' : 'BDT' 
      })),
      setCurrency: (currency) => set({ currentCurrency: currency }),
      setUsdtRate: (rate) => set({ usdtRate: rate }),
      convertPrice: (priceTk) => {
        const { currentCurrency, usdtRate } = get();
        if (currentCurrency === 'BDT') {
          return { amount: priceTk, currency: 'BDT' };
        }
        return { amount: Math.ceil(priceTk / usdtRate), currency: 'USDT' };
      },
    }),
    {
      name: 'currency-storage',
    }
  )
);
