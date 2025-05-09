import { create } from 'zustand';

interface StoreState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  user: any;
  setUser: (user: any) => void;
}

const useStore = create<StoreState>((set) => ({
  theme: 'light',
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  user: null,
  setUser: (user) => set({ user }),
}));

export default useStore;
