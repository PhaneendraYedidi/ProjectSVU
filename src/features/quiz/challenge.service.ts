import api from "../../api/client";

export const createChallenge = async () => {
    const res = await api.post("/challenges/create");
    return res.data;
};

export const joinChallenge = async (code: string) => {
    const res = await api.post("/challenges/join", { code });
    return res.data;
};

export const getChallenge = async (id: string) => {
    const res = await api.get(`/challenges/${id}`);
    return res.data;
};

export const submitChallengeScore = async (id: string, score: number) => {
    const res = await api.post(`/challenges/${id}/submit`, { score });
    return res.data;
};
