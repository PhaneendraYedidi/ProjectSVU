import apiClient from "../../api/client";

export const getProfile = async () => {
  const res = await apiClient.get("/user/profile");
  return res.data;
};
export const updateProfile = async (data: any) => {
  const res = await apiClient.put("/user/profile", data);
  return res.data;
};
