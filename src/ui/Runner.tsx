import { useEffect, useState } from "react";

import { findQuestion, findSet } from "../domain/question-sets";
import { advance, chooseDifficulty, finish, remainingMs, stageOf } from "../domain/session";
import { DIFFICULTIES, rulesFor } from "../domain/types";
import { nextAttemptNo } from "../storage/db";
import { errorMessage, formatDuration } from "./format";
import { QuestionStep } from "./QuestionStep";

import type { Recording } from "../media/recorder";
import type { PracticeStore } from "../storage/db";
import type { Attempt, Difficulty, QuestionSet, Session } from "../domain/types";

type Props = { store: PracticeStore; sessionId: string; onReview: (sessionId: string) => void; onHome: () => void };

const DIFFICULTY_LABEL: Record<Difficulty, string> = { easier: "쉬운 질문", similar: "비슷한 질문", harder: "어려운 질문" };

function useExamClock(session: Session | null): number | null {
  const [now, setNow] = useState(() => Date.now());
  const isTimed = session !== null && session.status === "in-progress" && rulesFor(session.settings.mode).totalLimitMs !== null;
  useEffect(() => {
    if (!isTimed) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [isTimed]);
  return session ? remainingMs(session, now) : null;
}

export function Runner({ store, sessionId, onReview, onHome }: Props) {
  const [session, setSession] = useState<Session | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [error, setError] = useState<string | null>(null);
  const remaining = useExamClock(session);

  useEffect(() => {
    void (async () => {
      try {
        setSession((await store.getSession(sessionId)) ?? null);
        setAttempts(await store.listAttempts(sessionId));
      } catch (loadError) {
        setError(errorMessage(loadError));
      }
    })();
  }, [store, sessionId]);

  async function persist(next: Session) {
    try {
      await store.saveSession(next);
      setSession(next);
      setError(null);
    } catch (saveError) {
      setError(`진행 상태를 저장하지 못했습니다. ${errorMessage(saveError)}`);
    }
  }

  const timeUpOutsideQuestion =
    remaining === 0 && session?.status === "in-progress" && stageOf(session).kind !== "question";
  useEffect(() => {
    if (timeUpOutsideQuestion && session) void persist(finish(session));
  });

  const set = session ? findSet(session.setId) : undefined;
  if (error && !session) return <p className="error" role="alert">{error}</p>;
  if (!session || !set) return <p role="status">불러오는 중…</p>;

  async function saveRecording(questionId: string, recording: Recording) {
    const attempt: Attempt = {
      id: crypto.randomUUID(),
      sessionId,
      questionId,
      attemptNo: nextAttemptNo(attempts, questionId),
      mimeType: recording.mimeType,
      durationMs: recording.durationMs,
      sizeBytes: recording.blob.size,
      createdAt: Date.now(),
      note: "",
    };
    await store.saveAttempt(attempt, recording.blob);
    setAttempts((current) => [...current, attempt]);
  }

  const mode = session.settings.mode;
  return (
    <main>
      <header className="run-header">
        <h1>{mode === "exam" ? "실전 모드" : "연습 모드"} · {set.title}</h1>
        {remaining !== null && session.status === "in-progress" && (
          <p className="clock" aria-live="off">남은 시간 {formatDuration(remaining)}</p>
        )}
        <button type="button" onClick={onHome}>나가기 (진행 상태는 저장됨)</button>
      </header>
      {error && <p className="error" role="alert">{error}</p>}
      <Stage
        session={session}
        set={set}
        attempts={attempts}
        timeUp={remaining === 0}
        onSaveRecording={saveRecording}
        onPersist={persist}
        onReview={() => onReview(sessionId)}
      />
    </main>
  );
}

type StageProps = {
  session: Session;
  set: QuestionSet;
  attempts: Attempt[];
  timeUp: boolean;
  onSaveRecording: (questionId: string, recording: Recording) => Promise<void>;
  onPersist: (next: Session) => Promise<void>;
  onReview: () => void;
};

function Stage({ session, set, attempts, timeUp, onSaveRecording, onPersist, onReview }: StageProps) {
  const stage = stageOf(session);
  if (stage.kind === "completed") {
    return (
      <section className="card">
        <h2>모든 문항을 마쳤습니다</h2>
        <p>녹음은 이 브라우저에 저장되었습니다. 복기 화면에서 다시 듣고 메모를 남길 수 있습니다.</p>
        <button type="button" className="primary" onClick={onReview}>복기하기</button>
      </section>
    );
  }
  if (stage.kind === "choose-difficulty") {
    return <DifficultyChoice onChoose={(difficulty) => onPersist(chooseDifficulty(session, set, difficulty))} />;
  }
  const question = findQuestion(set, stage.questionId);
  if (!question) return <p className="error" role="alert">문항을 찾을 수 없습니다: {stage.questionId}</p>;
  const rules = rulesFor(session.settings.mode);
  const part = stage.number <= set.firstSession.length ? "1차" : "2차";
  return (
    <QuestionStep
      key={question.id}
      question={question}
      heading={`${part} 세션 · 문항 ${stage.number}`}
      rules={{ ...rules, allowRerecord: session.settings.mode === "practice" }}
      practiceTargetSec={session.settings.practiceTargetSec}
      alreadySaved={attempts.some((attempt) => attempt.questionId === question.id)}
      timeUp={timeUp}
      onSave={(recording) => onSaveRecording(question.id, recording)}
      onNext={() => void onPersist(advance(session))}
      onTimeUpHandled={() => void onPersist(finish(session))}
    />
  );
}

function DifficultyChoice({ onChoose }: { onChoose: (difficulty: Difficulty) => void }) {
  return (
    <section className="card">
      <h2>난이도 재조정</h2>
      <p>2차 세션의 질문 난이도를 고르세요. 공식 시험처럼 선택에 따라 남은 문항 수가 달라집니다.</p>
      <div className="actions">
        {DIFFICULTIES.map((difficulty) => (
          <button type="button" key={difficulty} onClick={() => onChoose(difficulty)}>
            {DIFFICULTY_LABEL[difficulty]}
          </button>
        ))}
      </div>
    </section>
  );
}
