import api from "../../api/client";

export const fetchPracticeQuestions = async (payload: any) => {
  console.log(payload);
  const res = await api.get("/practice/questions", payload);
  console.log(res.data);
  return res.data;
};

export const bookmarkQuestion = async (id: string) => {
  await api.post(`/questions/${id}/bookmark`);
};

export const reportQuestion = async (id: string, reason: string) => {
  await api.post(`/questions/${id}/report`, { reason });
};
