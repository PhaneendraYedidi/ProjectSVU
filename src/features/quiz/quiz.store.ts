import { create } from "zustand";

interface QuizState {
  questions: any[];
  currentIndex: number;
  answers: Record<string, string>;
  timeTaken: Record<string, number>;
  questionStartTime: number | null;
  showExplanation: boolean;

  setQuestions: (qs: any[]) => void;
  selectAnswer: (qid: string, option: string) => void;
  next: () => void;
  startTimer: () => void;
  stopTimer: (qid: string) => void;
  reset: () => void;
  revealExplanation: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  questions: [],
  currentIndex: 0,
  answers: {},
  timeTaken: {},
  questionStartTime: null,
  showExplanation: false,

  setQuestions: (qs) =>
    set({
      questions: qs,
      currentIndex: 0,
      answers: {},
      timeTaken: {},
    }),

  startTimer: () => {
    set({ questionStartTime: Date.now() });
  },

  stopTimer: (qid) => {
    const start = get().questionStartTime;
    if (!start) return;

    const time = Math.floor((Date.now() - start) / 1000);

    set((state) => ({
      timeTaken: {
        ...state.timeTaken,
        [qid]: time,
      },
      questionStartTime: null,
    }));
  },

  selectAnswer: (qid, option) =>
    set((state) => ({
      answers: { ...state.answers, [qid]: option },
      showExplanation: true,
    })),

  revealExplanation: () => set({ showExplanation: true }),

  next: () => {
    set((state) => ({
      currentIndex: state.currentIndex + 1,
      showExplanation: false,
    }));
  },

  reset: () => ({
    questions: [],
    currentIndex: 0,
    answers: {},
    timeTaken: {},
    questionStartTime: null,
  }),
}));
