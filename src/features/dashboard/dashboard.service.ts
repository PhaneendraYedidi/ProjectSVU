import { apiClient } from "../../api/client";
import  API  from "../../api/endpoints";

export const getDashboard = async () => {
  const res = await apiClient.get(API.DASHBOARD);
  return res.data;
};
