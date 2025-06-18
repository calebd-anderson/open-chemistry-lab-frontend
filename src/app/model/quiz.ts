export interface Quiz {
  id: string;
  reaction: Reaction
  questionAnswerList: [QuestionAnswer]
}

type Reaction = {
  formula: string
  title: string
  elements: [Element]
}

type Element = {
  symbol: string
  atoms: number
}

type QuestionAnswer = {
  question: string
  answer: string
}

enum QuizType {
  ELEMENT,
  COMPOUND
}
