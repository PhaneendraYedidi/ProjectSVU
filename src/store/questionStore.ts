import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface QuestionState {
  bookmarkedQuestionIds: string[];
  questionTimes: Record<string, number>; // questionId: timeElapsed
  questionCorrect: Record<string, boolean>;
  toggleBookmark: (questionId: string) => void;
  recordTime: (questionId: string, time: number) => void;
  recordAnswer: (questionId: string, correct: boolean) => void;
}

export const useQuestionStore = create<QuestionState>()(
  persist(
    (set, get) => ({
      bookmarkedQuestionIds: [],
      questionTimes: {},
      questionCorrect: {},
      toggleBookmark: (questionId: string) => {
        const currentBookmarkedIds = get().bookmarkedQuestionIds;
        const isBookmarked = currentBookmarkedIds.includes(questionId);

        if (isBookmarked) {
          // Remove the bookmark
          set({
            bookmarkedQuestionIds: currentBookmarkedIds.filter(
              id => id !== questionId,
            ),
          });
        } else {
          // Add the bookmark
          set({
            bookmarkedQuestionIds: [...currentBookmarkedIds, questionId],
          });
        }
      },
      recordTime: (questionId: string, time: number) => {
        set({
          questionTimes: { ...get().questionTimes, [questionId]: time },
        });
      },
      recordAnswer: (questionId: string, correct: boolean) => {
        set({
          questionCorrect: { ...get().questionCorrect, [questionId]: correct },
        });
      },
    }),
    {
      name: 'question-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);