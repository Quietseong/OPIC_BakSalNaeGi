import { practiceDifficulty } from "./generate";
import { rulesFor } from "./types";

import type { ExamPlan } from "./generate";
import type { Difficulty, Session, SessionSettings } from "./types";

export type SessionStage =
  | { kind: "question"; questionId: string; number: number }
  | { kind: "choose-difficulty" }
  | { kind: "completed" };

export function createSession(
  plan: ExamPlan,
  settings: SessionSettings,
  options: { id: string; now: number; poolVersion: number },
): Session {
  const branchesLater = rulesFor(settings.mode).askDifficultyAfterFirstSession;
  const difficulty = branchesLater ? null : practiceDifficulty(settings.selfAssessment);
  return {
    id: options.id,
    poolVersion: options.poolVersion,
    settings,
    startedAt: options.now,
    questionIds: difficulty === null ? plan.first : [...plan.first, ...plan.second[difficulty]],
    secondSession: plan.second,
    currentIndex: 0,
    difficulty,
    status: "in-progress",
  };
}

export function firstSessionLength(session: Session): number {
  const secondLength = session.difficulty === null ? 0 : session.secondSession[session.difficulty].length;
  return session.questionIds.length - secondLength;
}

export function stageOf(session: Session): SessionStage {
  if (session.status === "completed") return { kind: "completed" };
  const questionId = session.questionIds[session.currentIndex];
  if (questionId !== undefined) {
    return { kind: "question", questionId, number: session.currentIndex + 1 };
  }
  if (session.difficulty === null) return { kind: "choose-difficulty" };
  return { kind: "completed" };
}

export function chooseDifficulty(session: Session, difficulty: Difficulty): Session {
  if (stageOf(session).kind !== "choose-difficulty") return session;
  return { ...session, difficulty, questionIds: [...session.questionIds, ...session.secondSession[difficulty]] };
}

export function advance(session: Session): Session {
  if (stageOf(session).kind !== "question") return session;
  const next = { ...session, currentIndex: session.currentIndex + 1 };
  return stageOf(next).kind === "completed" ? { ...next, status: "completed" } : next;
}

export function finish(session: Session): Session {
  return { ...session, status: "completed" };
}

export function remainingMs(session: Session, now: number): number | null {
  const limit = rulesFor(session.settings.mode).totalLimitMs;
  if (limit === null) return null;
  return Math.max(0, session.startedAt + limit - now);
}
