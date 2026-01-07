import { create } from "zustand";

interface DashboardState {
  data: any;
  load: (d: any) => void;
  clear: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  data: null,
  load: (d) => set({ data: d }),
  clear: () => set({ data: null }),
}));
