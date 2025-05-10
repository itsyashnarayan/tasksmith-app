import { create } from 'zustand';

interface StoreState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  user: any;
  setUser: (user: any) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const useStore = create<StoreState>((set) => ({
  theme: 'light',
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

  user: null,
  setUser: (user) => set({ user }),

  isSidebarOpen: true,
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

 

}));


export default useStore;
