import { create } from "zustand";
import { useAuthStore } from "../auth/auth.store";

interface SubscriptionState {
  plan: "free" | "premium";
  expiresAt?: string | null;

  setSubscription: (sub: any) => void;
  isPremium: () => boolean;
  isExpired: () => boolean;
}

export const useSubscriptionStore = create<SubscriptionState>((set: any) => ({
  plan: "free",
  expiresAt: null,

  setSubscription: (sub: any) =>
    set({
      plan: sub?.plan || "free",
      expiresAt: sub?.expiresAt || null,
    }),

  isPremium: (): boolean => {
    const authSub = useAuthStore.getState().subscription;
    return authSub?.plan === "premium";
  },

  isExpired: (): boolean => {
    const authSub = useAuthStore.getState().subscription;
    const exp = authSub?.expiresAt;

    // If no expiration date is set (e.g., lifetime premium), it's not expired
    if (!exp) return false;

    return new Date(exp) < new Date();
  },
}));
