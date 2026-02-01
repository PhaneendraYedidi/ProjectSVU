import { apiClient } from "../../api/client";

export const createChallenge = async () => {
    const res = await apiClient.post("/challenges/create");
    return res.data;
};

export const joinChallenge = async (code: string) => {
    const res = await apiClient.post("/challenges/join", { code });
    return res.data;
};

export const getChallenge = async (id: string) => {
    const res = await apiClient.get(`/challenges/${id}`);
    return res.data;
};

export const submitChallengeScore = async (id: string, score: number) => {
    const res = await apiClient.post(`/challenges/${id}/submit`, { score });
    return res.data;
};
