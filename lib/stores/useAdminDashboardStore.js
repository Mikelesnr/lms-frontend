import { create } from "zustand";

export const useAdminDashboardStore = create((set) => ({
  view: "overview",
  setView: (v) => set({ view: v }),

  stats: null,
  setStats: (s) => set({ stats: s }),
}));
