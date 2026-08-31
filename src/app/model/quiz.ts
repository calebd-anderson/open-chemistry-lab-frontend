export interface UserQuiz {
    id: string;
  // questionAnswerList: QuestionAnswer[];
    userId: string;
    question: string;
    answer: string;
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
