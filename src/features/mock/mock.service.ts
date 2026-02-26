import { apiClient } from "../../api/client";

export const startMockApi = async () => {
  const res = await apiClient.post("/mock/start");
  return res.data;
};

export const listMockTests = async () => {
  const res = await apiClient.get("/mock/list");
  return res.data;
};

export const startMockFromTemplate = async (templateId: string) => {
  const res = await apiClient.post(`/mock/start/${templateId}`);
  return res.data;
};

export const submitMockApi = async (mockTestId: string, answers: any) => {
  const res = await apiClient.post(`/mock/${mockTestId}/submit`, { answers });
  return res.data;
};
