import api from "../../api/client";

export const fetchPracticeQuestions = async (payload: any) => {
  const res = await api.post("/practice/questions", payload);
  return res.data;
};

export const bookmarkQuestion = async (id: string) => {
  await api.post(`/questions/${id}/bookmark`);
};

export const reportQuestion = async (id: string, reason: string) => {
  await api.post(`/questions/${id}/report`, { reason });
};
