import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

export type SubscriptionInfo = {
  plan: "free" | "premium";
  expiresAt: string | null;
};

type User = {
  id: string;
  name: string;
};

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  subscription: SubscriptionInfo | null;
  isHydrated: boolean;

  setAuth: (data: {
    user: User;
    accessToken: string;
    refreshToken: string;
    subscription: SubscriptionInfo;
  }) => void;

  // setAccessToken: (token: string) => void;
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  subscription: null,
  isHydrated: false,

  setAuth: async (data: any) => {
    await AsyncStorage.multiSet([
      ["accessToken", data.accessToken],
      ["refreshToken", data.refreshToken],
      ["user", JSON.stringify(data.user)],
      ["subscription", JSON.stringify(data.subscription)],
    ]);
    set({
      user: data.user,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      subscription: data.subscription,
    });
  },

  hydrate: async () => {
    const [[, accessToken], [, refreshToken], [, user], [, subscription]] =
      await AsyncStorage.multiGet([
        "accessToken",
        "refreshToken",
        "user",
        "subscription"
      ]);

    set({
      accessToken,
      refreshToken,
      user: user ? JSON.parse(user) : null,
      isHydrated: true,
      subscription: subscription ? JSON.parse(subscription) : null,
    });
  },

  // setAccessToken: token =>
  //   set({ accessToken: token }),

  setTokens: (tokens) =>
    set({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    }),


  logout: async () => {
    await AsyncStorage.clear();
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      subscription: null,
    });
  },
}));
