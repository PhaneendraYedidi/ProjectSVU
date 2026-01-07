import apiClient from "../../api/client";

export const getProfile = async () => {
  const res = await apiClient.get("/user/profile");
  return res.data;
};
