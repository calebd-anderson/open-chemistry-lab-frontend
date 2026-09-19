export interface Flashcard {
  id?: number;
  term: string;
  question: string;
  answer: string;
  userId?: string;
  flipped?: boolean;
  createdAt?: string;
  updatedAt?: string;
}