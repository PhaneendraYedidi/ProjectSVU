import {apiClient} from "../../api/client";

export const fetchPracticeQuestions = async (params: any) => {
  console.log("Fetching questions with:", params);
  const res = await apiClient.get("/practice/questions", { params });
  return res.data;
};

export const fetchFilters = async () => {
  const res = await apiClient.get("/practice/filters");
  return res.data;
};

export const bookmarkQuestion = async (id: string) => {
  await apiClient.post(`/practice/bookmark`, { questionId: id });
};

export const reportQuestion = async (id: string, reason: string) => {
  // Mock endpoint if not exists, or verify path
  await apiClient.post(`/questions/${id}/report`, { reason });
};
