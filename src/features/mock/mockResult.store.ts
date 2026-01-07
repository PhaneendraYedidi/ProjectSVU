import { create } from "zustand";

export const useMockResultStore = create<any>((set) => ({
  result: null,
  setResult: (r: any) => set({ result: r }),
  clear: () => set({ result: null }),
}));
