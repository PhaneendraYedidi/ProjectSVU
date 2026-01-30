import api from "../../api/client";

export const fetchPracticeQuestions = async (params: any) => {
  console.log("Fetching questions with:", params);
  const res = await api.get("/practice/questions", { params });
  return res.data;
};

export const fetchFilters = async () => {
  const res = await api.get("/practice/filters");
  return res.data;
};

export const bookmarkQuestion = async (id: string) => {
  await api.post(`/practice/bookmark`, { questionId: id });
};

export const reportQuestion = async (id: string, reason: string) => {
  // Mock endpoint if not exists, or verify path
  await api.post(`/questions/${id}/report`, { reason });
};
