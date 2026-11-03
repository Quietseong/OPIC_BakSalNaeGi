export type QuestionType =
  | "self-introduction"
  | "description"
  | "routine"
  | "change"
  | "past-experience"
  | "roleplay-ask"
  | "roleplay-solve"
  | "roleplay-experience"
  | "comparison"
  | "issue";

export type Question = {
  id: string;
  topic: string;
  type: QuestionType;
  prompt: string;
};

export type Difficulty = "easier" | "similar" | "harder";

export const DIFFICULTIES: readonly Difficulty[] = ["easier", "similar", "harder"];

export type QuestionSet = {
  id: string;
  version: number;
  title: string;
  firstSession: Question[];
  secondSession: Record<Difficulty, Question[]>;
};

export type Mode = "practice" | "exam";

export type PracticeTargetSec = 90 | 120 | null;

export type SessionSettings = {
  mode: Mode;
  practiceTargetSec: PracticeTargetSec;
};

export type ModeRules = {
  maxListens: number | null;
  showPromptText: boolean;
  totalLimitMs: number | null;
  askDifficultyAfterFirstSession: boolean;
};

export const EXAM_TOTAL_LIMIT_MS = 40 * 60 * 1000;

export function rulesFor(mode: Mode): ModeRules {
  if (mode === "exam") {
    return {
      maxListens: 2,
      showPromptText: false,
      totalLimitMs: EXAM_TOTAL_LIMIT_MS,
      askDifficultyAfterFirstSession: true,
    };
  }
  return {
    maxListens: null,
    showPromptText: true,
    totalLimitMs: null,
    askDifficultyAfterFirstSession: false,
  };
}

export type SessionStatus = "in-progress" | "completed";

export type Session = {
  id: string;
  setId: string;
  setVersion: number;
  settings: SessionSettings;
  startedAt: number;
  questionIds: string[];
  currentIndex: number;
  difficulty: Difficulty | null;
  status: SessionStatus;
};

export type Attempt = {
  id: string;
  sessionId: string;
  questionId: string;
  attemptNo: number;
  mimeType: string;
  durationMs: number;
  sizeBytes: number;
  createdAt: number;
  note: string;
};
