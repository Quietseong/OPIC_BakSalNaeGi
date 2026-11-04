import { useCallback, useEffect, useState } from "react";

import { newAttempt } from "../domain/attempt";
import { findQuestion } from "../domain/questions";
import { scheduleReview } from "../domain/review-schedule";
import { rulesFor } from "../domain/types";
import { nextAttemptNo } from "../storage/db";
import { AttemptRow } from "./AttemptRow";
import { errorMessage, formatDate } from "./format";
import { QuestionStep } from "./QuestionStep";

import type { Recording } from "../media/recorder";
import type { PracticeStore } from "../storage/db";
import type { Attempt, Question, Session } from "../domain/types";

type Props = { store: PracticeStore; sessionId: string; onHome: () => void };

function downloadJson(filename: string, data: unknown) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
  const link = Object.assign(document.createElement("a"), { href: url, download: filename });
  link.click();
  URL.revokeObjectURL(url);
}

export function Review({ store, sessionId, onHome }: Props) {
  const [session, setSession] = useState<Session | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      setSession((await store.getSession(sessionId)) ?? null);
      setAttempts(await store.listAttempts(sessionId));
    } catch (loadError) {
      setError(errorMessage(loadError));
    }
  }, [store, sessionId]);

  useEffect(() => void reload(), [reload]);

  if (error) return <p className="error" role="alert">{error}</p>;
  if (!session) return <p role="status">불러오는 중…</p>;

  async function deleteSession() {
    if (!window.confirm("이 연습 기록과 녹음을 모두 삭제할까요? 되돌릴 수 없습니다.")) return;
    await store.deleteSession(sessionId);
    onHome();
  }

  const questions = session.questionIds
    .map((id) => findQuestion(id))
    .filter((question): question is Question => question !== undefined);

  return (
    <main>
      <header className="run-header">
        <h1>복기</h1>
        <button type="button" onClick={onHome}>처음으로</button>
      </header>
      <p className="muted">
        {formatDate(session.startedAt)} · {session.settings.mode === "exam" ? "실전 모드" : "연습 모드"} · 녹음 {attempts.length}개.
        재답변은 대본을 외우는 연습이 아니라, 같은 질문에 다른 방식으로 말해 보는 연습입니다.
      </p>
      <div className="actions">
        <button type="button" onClick={() => downloadJson(`opic-session-${sessionId}.json`, { session, attempts, questions })}>
          기록 내보내기 (JSON)
        </button>
        <button type="button" className="danger" onClick={deleteSession}>이 기록 삭제</button>
      </div>
      <ol className="review-list">
        {questions.map((question) => (
          <ReviewItem
            key={question.id}
            store={store}
            sessionId={sessionId}
            question={question}
            attempts={attempts.filter((attempt) => attempt.questionId === question.id)}
            allAttempts={attempts}
            onChanged={reload}
          />
        ))}
      </ol>
    </main>
  );
}

type ItemProps = {
  store: PracticeStore;
  sessionId: string;
  question: Question;
  attempts: Attempt[];
  allAttempts: Attempt[];
  onChanged: () => Promise<void>;
};

function ReviewItem({ store, sessionId, question, attempts, allAttempts, onChanged }: ItemProps) {
  const [isAnsweringAgain, setIsAnsweringAgain] = useState(false);
  const [reviewDue, setReviewDue] = useState<number | null>(null);
  const latestRevision = [...attempts].reverse().find((attempt) => attempt.revised.trim() !== "")?.revised;

  async function addToReview() {
    const card = scheduleReview(await store.getReviewCard(question.id), question.id, "stuck", Date.now());
    await store.saveReviewCard(card);
    setReviewDue(card.dueAt);
  }

  async function saveAgain(recording: Recording) {
    const attempt = newAttempt(
      { sessionId, questionId: question.id, attemptNo: nextAttemptNo(allAttempts, question.id), mimeType: recording.mimeType, durationMs: recording.durationMs, sizeBytes: recording.blob.size },
      { id: crypto.randomUUID(), now: Date.now() },
    );
    await store.saveAttempt(attempt, recording.blob);
    await onChanged();
  }

  return (
    <li className="card review-item">
      <h2 className="topic">{question.topic}</h2>
      <p className="prompt" lang="en">{question.prompt}</p>
      {attempts.length === 0 && <p className="muted">저장된 답변이 없습니다.</p>}
      {attempts.map((attempt) => (
        <AttemptRow key={attempt.id} store={store} attempt={attempt} onChanged={onChanged} />
      ))}
      <div className="actions">
        <button type="button" onClick={() => void addToReview()} disabled={reviewDue !== null}>복습 목록에 넣기</button>
        {reviewDue !== null && <span role="status">{formatDate(reviewDue)}에 다시 나옵니다.</span>}
      </div>
      {isAnsweringAgain && latestRevision && (
        <p className="revision-ref"><strong>고친 문장 보며 말하기 · </strong><span lang="en">{latestRevision}</span></p>
      )}
      {isAnsweringAgain ? (
        <QuestionStep
          question={question}
          heading="다시 답변"
          rules={{ ...rulesFor("practice"), allowRerecord: true, allowPause: false }}
          practiceTargetSec={null}
          alreadySaved={false}
          onSave={saveAgain}
        />
      ) : (
        <button type="button" onClick={() => setIsAnsweringAgain(true)}>이 질문에 다시 답변</button>
      )}
    </li>
  );
}
