import axios from "axios";
import { Platform } from "react-native";
import { MOCK_DATA } from "./mockData";

// Toggle this to force mock mode even if backend is running
const FORCE_MOCK = true;

export const apiClient = axios.create({
  baseURL: Platform.OS === "android" ? "http://10.0.2.2:5001/api" : "http://localhost:5001/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(config => {
  if (__DEV__ || FORCE_MOCK) {
    const path = config.url?.replace("/api", "") || "";
    console.log(`[API] Request: ${path}`);

    // Check exact match or partial match
    // Simple mock matching logic
    const mockKey = Object.keys(MOCK_DATA).find(key => path.includes(key));

    if (mockKey) {
      console.log(`[API] Returning Mock Data for ${mockKey}`);
      const mockResponse = (MOCK_DATA as any)[mockKey];

      // Throwing an error with 'response' property to be caught by axios adapter usually 
      // OR simpler: use an adapter. But since we are inside interceptor, let's use adapter approach 
      // actually easier to set adapter on the instance.
    }
  }
  return config;
});

// Better approach: Mock Adapter
// Since I cannot install axios-mock-adapter easily, I will overwrite the adapter.

// Custom Adapter to handle Mocks
apiClient.defaults.adapter = async (config) => {
  if (__DEV__ || FORCE_MOCK) {
    const path = config.url?.replace(config.baseURL || "", "") || "";
    const mockKey = Object.keys(MOCK_DATA).find(key => path.includes(key));

    if (mockKey) {
      console.log(`[API MOCK] Serving: ${mockKey}`);
      return {
        data: (MOCK_DATA as any)[mockKey],
        status: 200,
        statusText: "OK",
        headers: {},
        config,
        request: {}
      } as any;
    }
  }

  // Fallback using Fetch
  try {
    const response = await fetch(config.url!, {
      method: config.method?.toUpperCase(),
      headers: config.headers as any,
      body: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data
    });
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    // Convert Headers to plain object
    const headers: any = {};
    response.headers.forEach((val: string, key: string) => { headers[key] = val; });

    return {
      data,
      status: response.status,
      statusText: "OK",
      headers,
      config,
      request: {}
    } as any;
  } catch (e) {
    // Return structured error for Axios to handle
    const error: any = new Error("Network Error");
    error.config = config;
    error.request = {};
    error.response = {
      data: { message: "Network Error" },
      status: 500,
      statusText: "Internal Server Error",
      headers: {},
      config,
      request: {}
    };
    throw error;
  }
};
