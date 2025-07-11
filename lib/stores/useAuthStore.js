import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),

      logout: () => set({ user: null, token: null }),
    }),
    {
      name: "auth-storage", // name of the localStorage key
      partialize: (state) => ({ user: state.user, token: state.token }), // only persist what you need
    }
  )
);
