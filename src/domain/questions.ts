import { allPoolQuestions } from "./generate";
import { QUESTION_POOL } from "./question-pool-data";
import { PRACTICE_SET_A } from "./question-sets";

import type { Question } from "./types";

// Set A stays registered so sessions recorded before the pool existed can still be reviewed.
const LEGACY_QUESTIONS = [...PRACTICE_SET_A.firstSession, ...Object.values(PRACTICE_SET_A.secondSession).flat()];

const BY_ID = new Map<string, Question>([...LEGACY_QUESTIONS, ...allPoolQuestions(QUESTION_POOL)].map((q) => [q.id, q]));

export function findQuestion(questionId: string): Question | undefined {
  return BY_ID.get(questionId);
}
