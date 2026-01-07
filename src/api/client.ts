import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
