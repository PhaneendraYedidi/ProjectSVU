import { create } from "zustand";
import { useAuthStore } from "../auth/auth.store";

interface SubscriptionState {
  plan: "free" | "premium";
  expiresAt?: string | null;

  setSubscription: (sub: any) => void;
  isPremium: () => boolean;
  isExpired: () => boolean;
};

export const useSubscriptionStore = create<SubscriptionState>((set: any) => ({
  // isPremium: false,
  // isExpired: true,
  // expiresAt: null,

  // refreshFromAuth: () => {
  //   const { subscription } = useAuthStore.getState();

  //   if (!subscription || subscription.plan === "free") {
  //     set({
  //       isPremium: false,
  //       isExpired: true,
  //       expiresAt: null,
  //     });
  //     return;
  //   }

  //   const expiresAt = new Date(subscription.expiresAt);
  //   const isExpired = expiresAt.getTime() < Date.now();

  //   set({
  //     isPremium: !isExpired,
  //     isExpired,
  //     expiresAt,
  //   });
  // },
  plan: "free",
  expiresAt: null,

  setSubscription: (sub: any) =>
    set({
      plan: sub.plan,
      expiresAt: sub.expiresAt,
    }),

  isPremium: (): boolean => {
    return useSubscriptionStore.getState().plan === "premium";
  },

  isExpired: (): boolean => {
    const exp = useSubscriptionStore.getState().expiresAt;
    return exp ? new Date(exp) < new Date() : true;
  },
}));
