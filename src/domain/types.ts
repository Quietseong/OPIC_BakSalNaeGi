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

export type Topic = {
  id: string;
  name: string;
  descriptions: Question[];
  routines: Question[];
  changes: Question[];
  experiences: Question[];
};

export type Roleplay = {
  id: string;
  name: string;
  ask: Question;
  solve: Question;
  experience: Question;
};

export type AdvancedTopic = {
  id: string;
  name: string;
  comparison: Question;
  issue: Question;
};

export type QuestionPool = {
  version: number;
  intros: Question[];
  topics: Topic[];
  roleplays: Roleplay[];
  advanced: AdvancedTopic[];
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

export type SelfAssessment = 1 | 2 | 3 | 4 | 5 | 6;

export type SessionSettings = {
  mode: Mode;
  practiceTargetSec: PracticeTargetSec;
  topicIds: string[];
  selfAssessment: SelfAssessment;
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
  poolVersion: number;
  settings: SessionSettings;
  startedAt: number;
  questionIds: string[];
  secondSession: Record<Difficulty, string[]>;
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
  transcript: string;
  revised: string;
};

export type AttemptText = Pick<Attempt, "note" | "transcript" | "revised">;

export type TrainingRecord = {
  id: string;
  questionId: string;
  createdAt: number;
  roundLimitsSec: number[];
};

export type ReviewCard = {
  questionId: string;
  box: number;
  dueAt: number;
  updatedAt: number;
};
