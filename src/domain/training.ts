import type { Question, TrainingRecord } from "./types";

export const TRAINING_ROUND_LIMITS_SEC = [90, 70, 50] as const;

export function newTraining(questionId: string, options: { id: string; now: number }): TrainingRecord {
  return { id: options.id, questionId, createdAt: options.now, roundLimitsSec: [...TRAINING_ROUND_LIMITS_SEC], plan: [] };
}

export function trainableQuestions(questions: Question[]): Question[] {
  return questions.filter((question) => question.type !== "self-introduction");
}
