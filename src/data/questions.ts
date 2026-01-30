export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export const MOCK_QUESTIONS: Question[] = [
  {
    id: '1',
    text: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctOptionIndex: 2,
    explanation: 'Paris is the capital and most populous city of France.',
  },
  {
    id: '2',
    text: 'Which planet is known as the Red Planet?',
    options: ['Earth', 'Mars', 'Jupiter', 'Venus'],
    correctOptionIndex: 1,
    explanation: 'Mars is often referred to as the "Red Planet" because the reddish iron oxide prevalent on its surface gives it a reddish appearance.',
  },
  {
    id: '3',
    text: 'What is the largest mammal in the world?',
    options: ['African Elephant', 'Blue Whale', 'Giraffe', 'Hippopotamus'],
    correctOptionIndex: 1,
    explanation: 'The blue whale is the largest animal known to have ever lived.',
  },
  {
    id: '4',
    text: 'Who wrote "Romeo and Juliet"?',
    options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'],
    correctOptionIndex: 1,
    explanation: 'Romeo and Juliet is a tragedy written by William Shakespeare early in his career.',
  },
  {
    id: '5',
    text: 'What is the chemical symbol for Gold?',
    options: ['Au', 'Ag', 'Fe', 'Cu'],
    correctOptionIndex: 0,
    explanation: 'The symbol Au is from the Latin: aurum.',
  },
];
