import { rulesFor } from "./types";
import type { Difficulty, QuestionSet, Session, SessionSettings } from "./types";

export type SessionStage =
  | { kind: "question"; questionId: string; number: number }
  | { kind: "choose-difficulty" }
  | { kind: "completed" };

export function createSession(
  set: QuestionSet,
  settings: SessionSettings,
  options: { id: string; now: number },
): Session {
  const firstIds = set.firstSession.map((question) => question.id);
  const branchesLater = rulesFor(settings.mode).askDifficultyAfterFirstSession;
  const secondIds = branchesLater ? [] : set.secondSession.similar.map((question) => question.id);
  return {
    id: options.id,
    setId: set.id,
    setVersion: set.version,
    settings,
    startedAt: options.now,
    questionIds: [...firstIds, ...secondIds],
    currentIndex: 0,
    difficulty: branchesLater ? null : "similar",
    status: "in-progress",
  };
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

export function chooseDifficulty(session: Session, set: QuestionSet, difficulty: Difficulty): Session {
  if (stageOf(session).kind !== "choose-difficulty") return session;
  const secondIds = set.secondSession[difficulty].map((question) => question.id);
  return { ...session, difficulty, questionIds: [...session.questionIds, ...secondIds] };
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
