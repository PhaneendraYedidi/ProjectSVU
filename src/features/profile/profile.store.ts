import { create } from "zustand";

interface ProfileState {
  profile: any;
  loadProfile: (p: any) => void;
  clear: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  loadProfile: (p) => set({ profile: p }),
  clear: () => set({ profile: null }),
}));
