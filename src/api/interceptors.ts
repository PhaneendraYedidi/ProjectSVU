import { apiClient } from "./client";
import API from "./endpoints";
import { useAuthStore } from "../auth/auth.store";
import { useSubscriptionStore } from "../subscription/subscription.store";

/**
 * Shared refresh state (MODULE LEVEL)
 */
let isRefreshing = false;

type FailedQueueItem = {
  resolve: (token: string) => void;
  reject: (error: any) => void;
};

let failedQueue: FailedQueueItem[] = [];

/**
 * Resolve / reject queued requests
 */
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

/* ---------------- REQUEST ---------------- */
apiClient.interceptors.request.use(async config => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

/* ---------------- RESPONSE ---------------- */
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const authStore = useAuthStore.getState();

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      authStore.refreshToken
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await apiClient.post(API.AUTH.REFRESH, {
          refreshToken: authStore.refreshToken,
        });

        const { accessToken } = res.data;

        authStore.setTokens({
          accessToken,
          refreshToken: authStore.refreshToken!,
        });

        apiClient.defaults.headers.Authorization =
          `Bearer ${accessToken}`;

        processQueue(null, accessToken);
        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        authStore.logout();
        throw err;
      } finally {
        isRefreshing = false;
      }
    }

    throw error;
  }
);

apiClient.interceptors.request.use((config) => {
  const { isPremium, isExpired } =
    useSubscriptionStore.getState();

  if (
    config.url?.includes("/mock") &&
    (!isPremium || isExpired)
  ) {
    return Promise.reject({
      message: "Subscription required",
    });
  }

  return config;
});

export default apiClient;

