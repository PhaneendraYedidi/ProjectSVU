import apiClient from "../api/client";
import API from "../api/endpoints";
import { useAuthStore } from "./auth.store";

type LoginPayload = {
  email: string;
  password: string;
};

export const signup = async (payload: {
  name: string;
  email: string;
  phone: string;
  password: string;
}) => {
  const { data } = await apiClient.post(API.AUTH.SIGNUP, payload);
  return data;
};

export const login = async (payload: LoginPayload) => {
  const res = await apiClient.post(API.AUTH.LOGIN, payload);

  /*const { user, accessToken, refreshToken, subscription } = res.data;

  useAuthStore.getState().setAuth({
    user,
    accessToken,
    refreshToken,
    subscription: {
      plan:
        subscription.plan === "PRO" ? "premium" : "free",
      expiresAt: subscription.expiresAt,
    },
  });*/

  return res.data;
};

export const logout = () => {
  useAuthStore.getState().logout();
};
