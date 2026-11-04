import { useEffect, useState } from "react";

import { newAttempt } from "../domain/attempt";
import { findQuestion } from "../domain/questions";
import { advance, chooseDifficulty, finish, firstSessionLength, remainingMs, stageOf } from "../domain/session";
import { DIFFICULTIES, rulesFor } from "../domain/types";
import { nextAttemptNo } from "../storage/db";
import { Avatar } from "./Avatar";
import { errorMessage, formatDuration } from "./format";
import { QuestionGrid } from "./QuestionGrid";
import { QuestionStep } from "./QuestionStep";

import type { Recording } from "../media/recorder";
import type { PracticeStore } from "../storage/db";
import type { Attempt, Difficulty, Session } from "../domain/types";

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

  if (error && !session) return <p className="error" role="alert">{error}</p>;
  if (!session) return <p role="status">불러오는 중…</p>;

  async function saveRecording(questionId: string, recording: Recording) {
    const attempt = newAttempt(
      { sessionId, questionId, attemptNo: nextAttemptNo(attempts, questionId), mimeType: recording.mimeType, durationMs: recording.durationMs, sizeBytes: recording.blob.size },
      { id: crypto.randomUUID(), now: Date.now() },
    );
    await store.saveAttempt(attempt, recording.blob);
    setAttempts((current) => [...current, attempt]);
  }

  return (
    <main className="exam">
      <header className="exam-bar">
        <h1>{session.settings.mode === "exam" ? "실전 모드" : "연습 모드"}</h1>
        {remaining !== null && session.status === "in-progress" && (
          <p className="exam-clock" aria-live="off">남은 시간 {formatDuration(remaining)}</p>
        )}
        <button type="button" onClick={onHome}>나가기 (진행 상태는 저장됨)</button>
      </header>
      {error && <p className="error" role="alert">{error}</p>}
      <div className="exam-layout">
        <aside className="exam-side">
          <Avatar />
          <QuestionGrid session={session} answeredIds={new Set(attempts.map((attempt) => attempt.questionId))} />
        </aside>
        <Stage
          session={session}
          attempts={attempts}
          timeUp={remaining === 0}
          onSaveRecording={saveRecording}
          onPersist={persist}
          onReview={() => onReview(sessionId)}
        />
      </div>
    </main>
  );
}

type StageProps = {
  session: Session;
  attempts: Attempt[];
  timeUp: boolean;
  onSaveRecording: (questionId: string, recording: Recording) => Promise<void>;
  onPersist: (next: Session) => Promise<void>;
  onReview: () => void;
};

function Stage({ session, attempts, timeUp, onSaveRecording, onPersist, onReview }: StageProps) {
  const stage = stageOf(session);
  if (stage.kind === "completed") {
    return (
      <section className="card exam-main">
        <h2>모든 문항을 마쳤습니다</h2>
        <p>녹음은 이 브라우저에 저장되었습니다. 복기 화면에서 다시 듣고 메모를 남길 수 있습니다.</p>
        <button type="button" className="primary" onClick={onReview}>복기하기</button>
      </section>
    );
  }
  if (stage.kind === "choose-difficulty") {
    return <DifficultyChoice onChoose={(difficulty) => onPersist(chooseDifficulty(session, difficulty))} />;
  }
  const question = findQuestion(stage.questionId);
  if (!question) return <p className="error" role="alert">문항을 찾을 수 없습니다: {stage.questionId}</p>;
  const rules = rulesFor(session.settings.mode);
  const part = stage.number <= firstSessionLength(session) ? "1차" : "2차";
  return (
    <QuestionStep
      key={question.id}
      question={question}
      heading={`${part} 세션 · 문항 ${stage.number}`}
      rules={{ ...rules, allowRerecord: session.settings.mode === "practice" }}
      practiceTargetSec={session.settings.practiceTargetSec}
      showCoaching={session.settings.mode === "practice"}
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
    <section className="card exam-main">
      <h2>난이도 재조정</h2>
      <p>2차 세션의 질문 난이도를 고르세요. 선택에 따라 남은 문항 수가 달라집니다(쉬운 5 · 비슷한 7 · 어려운 8).</p>
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
