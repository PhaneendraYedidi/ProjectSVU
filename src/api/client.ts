import axios from "axios";
import { Platform } from "react-native";

export const apiClient = axios.create({
  baseURL: Platform.OS === "android" ? "http://10.0.2.2:5001/api" : "http://localhost:5001/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(config => {
  if (__DEV__) {
    const path = config.url?.replace("/api", "") || "";
    console.log(`[API] Request: ${path}`);
  }
  return config;
});
