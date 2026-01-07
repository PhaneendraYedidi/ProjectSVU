import api from "../../api/client";

export const startMockApi = async () => {
  const res = await api.post("/mock/start");
  return res.data;
};

export const submitMockApi = async (payload: any) => {
  const res = await api.post("/mock/submit", payload);
  return res.data;
};
