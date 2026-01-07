import { create } from "zustand";

export const useMockStore = create<any>((set, get) => ({
  mockSessionId: null,
  questions: [],
  answers: {},
  startTime: null,
  duration: 0,

  startMock: (data: any) =>
    set({
      mockSessionId: data.mockSessionId,
      questions: data.questions,
      duration: data.duration,
      startTime: Date.now(),
      answers: {},
    }),

  selectAnswer: (qid: string, option: string) =>
    set((state) => ({
      answers: { ...state.answers, [qid]: option },
    })),

  reset: () =>
    set({
      mockSessionId: null,
      questions: [],
      answers: {},
      startTime: null,
      duration: 0,
    }),
}));
