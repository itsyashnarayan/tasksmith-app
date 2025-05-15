import { create } from 'zustand';

interface User {
  id: number;
  email: string;
  role: string;
  display_name: string;
}

interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: (() => {
    try {
      const stored = JSON.parse(localStorage.getItem('user') || 'null');
      if (stored && stored.email && !stored.display_name) {
        stored.display_name = stored.email.split('@')[0]; 
      }
      return stored;
    } catch {
      return null;
    }
  })(),

  setUser: (user: User) => {
    const enrichedUser = {
      ...user,
      display_name: user.display_name || user.email.split('@')[0],
    };

    localStorage.setItem('user', JSON.stringify(enrichedUser));
    set({ user: enrichedUser });
  },

  logout: () => {
    localStorage.clear();
    set({ user: null });
  },
}));
