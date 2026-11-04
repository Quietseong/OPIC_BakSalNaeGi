import { MODEL_ANSWERS_PART_1 } from "./part-1";
import { MODEL_ANSWERS_PART_2 } from "./part-2";
import { MODEL_ANSWERS_PART_3 } from "./part-3";
import { MODEL_ANSWERS_PART_4 } from "./part-4";

import type { ModelAnswer } from "../types";

export const MODEL_ANSWERS: ModelAnswer[] = [
  ...MODEL_ANSWERS_PART_1,
  ...MODEL_ANSWERS_PART_2,
  ...MODEL_ANSWERS_PART_3,
  ...MODEL_ANSWERS_PART_4,
];

const BY_QUESTION = new Map(MODEL_ANSWERS.map((answer) => [answer.questionId, answer]));

export function findModelAnswer(questionId: string): ModelAnswer | undefined {
  return BY_QUESTION.get(questionId);
}
