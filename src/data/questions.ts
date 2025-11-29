export interface Question {
  id: string;
  question: string;
  options: {
    id: 'A' | 'B' | 'C' | 'D';
    text: string;
  }[];
  correctAnswerId: 'A' | 'B' | 'C' | 'D';
  subject: string;
  tags: string[];
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  type: 'MCQ' | 'Multiple Select' | 'True/False' | 'Assertion-Reason';
  source: string;
  year?: number;
}

export const mockQuestions: Question[] = [
  {
    id: 'q1',
    question: 'What is the capital of India?',
    options: [
      {id: 'A', text: 'Delhi'},
      {id: 'B', text: 'Mumbai'},
      {id: 'C', text: 'Chennai'},
      {id: 'D', text: 'Kolkata'},
    ],
    correctAnswerId: 'A',
    subject: 'Polity',
    tags: ['basics', 'capitals'],
    explanation: 'Delhi has been the capital since 1911.',
    difficulty: 'Easy',
    type: 'MCQ',
    source: 'NCERT Class 6',
    year: 2019,
  },
  {
    id: 'q2',
    question: 'Which planet is known as the Red Planet?',
    options: [
      {id: 'A', text: 'Earth'},
      {id: 'B', text: 'Mars'},
      {id: 'C', text: 'Jupiter'},
      {id: 'D', text: 'Venus'},
    ],
    correctAnswerId: 'B',
    subject: 'Science',
    tags: ['space', 'planets', 'solar system'],
    explanation:
      'Mars is often called the "Red Planet" because of its reddish appearance, which is due to iron oxide (rust) on its surface.',
    difficulty: 'Easy',
    type: 'MCQ',
    source: 'NCERT Class 8',
  },
  {
    id: 'q3',
    question: 'Who wrote "To Kill a Mockingbird"?',
    options: [
      {id: 'A', text: 'Harper Lee'},
      {id: 'B', text: 'J.K. Rowling'},
      {id: 'C', text: 'Ernest Hemingway'},
      {id: 'D', text: 'F. Scott Fitzgerald'},
    ],
    correctAnswerId: 'A',
    subject: 'Literature',
    tags: ['books', 'american literature', 'classic'],
    explanation:
      '"To Kill a Mockingbird" is a novel by Harper Lee, published in 1960. It was immediately successful, winning the Pulitzer Prize, and has become a classic of modern American literature.',
    difficulty: 'Medium',
    type: 'MCQ',
    source: 'Literary History',
  },
];
