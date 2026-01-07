import { create } from "zustand";
import { useAuthStore } from "../auth/auth.store";

// type SubscriptionState = {
//   isPremium: boolean;
//   isExpired: boolean;
//   expiresAt: Date | null;
//   refreshFromAuth: () => void;
// };

export const useSubscriptionStore = create<any>((set: any) => ({
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

  isPremium: () => {
    return useSubscriptionStore.getState().plan !== "FREE";
  },

  isExpired: () => {
    const exp = useSubscriptionStore.getState().expiresAt;
    return exp ? new Date(exp) < new Date() : true;
  },
}));
