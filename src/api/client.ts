import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:5001/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
