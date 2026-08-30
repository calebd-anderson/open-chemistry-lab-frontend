export interface Quiz {
  id: string;
  reaction: Reaction;
  questionAnswerList: QuestionAnswer[];
}

export type Reaction = {
  formula: string;
  title: string;
  elements: Element[];
};

export type Element = {
  symbol: string;
  atoms: number;
};

export type QuestionAnswer = {
  question: string;
  answer: string;
};

enum QuizType {
  ELEMENT,
  COMPOUND,
}
