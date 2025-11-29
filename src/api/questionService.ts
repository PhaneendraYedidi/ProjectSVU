// src/api/questionService.ts
import { mockQuestions, Question } from '../data/questions';

// Simulate a network request
export const fetchQuestions = (): Promise<Question[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockQuestions);
    }, 500); // Simulate a 500ms network delay
  });
};
