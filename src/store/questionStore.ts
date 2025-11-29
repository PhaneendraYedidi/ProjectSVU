// src/store/questionStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface QuestionState {
  bookmarkedQuestionIds: string[];
  toggleBookmark: (questionId: string) => void;
}

export const useQuestionStore = create<QuestionState>()(
  persist(
    (set, get) => ({
      bookmarkedQuestionIds: [],
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
    }),
    {
      name: 'question-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
