import { useCallback, useEffect, useState } from "react";

import { findQuestion } from "../domain/questions";
import { rulesFor } from "../domain/types";
import { nextAttemptNo } from "../storage/db";
import { errorMessage, formatDate, formatDuration } from "./format";
import { QuestionStep } from "./QuestionStep";

import type { Recording } from "../media/recorder";
import type { PracticeStore } from "../storage/db";
import type { Attempt, Question, Session } from "../domain/types";

type Props = { store: PracticeStore; sessionId: string; onHome: () => void };

function extensionFor(mimeType: string): string {
  return mimeType.includes("mp4") ? "m4a" : "webm";
}

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

  async function saveAgain(recording: Recording) {
    const attempt: Attempt = {
      id: crypto.randomUUID(),
      sessionId,
      questionId: question.id,
      attemptNo: nextAttemptNo(allAttempts, question.id),
      mimeType: recording.mimeType,
      durationMs: recording.durationMs,
      sizeBytes: recording.blob.size,
      createdAt: Date.now(),
      note: "",
    };
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
      {isAnsweringAgain ? (
        <QuestionStep
          question={question}
          heading="다시 답변"
          rules={{ ...rulesFor("practice"), allowRerecord: true }}
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

function AttemptRow({ store, attempt, onChanged }: { store: PracticeStore; attempt: Attempt; onChanged: () => Promise<void> }) {
  const [url, setUrl] = useState<string | null>(null);
  const [note, setNote] = useState(attempt.note);
  const [problem, setProblem] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;
    void store.getRecording(attempt.id).then((blob) => {
      if (!blob) return setProblem("녹음 파일을 찾을 수 없습니다.");
      objectUrl = URL.createObjectURL(blob);
      setUrl(objectUrl);
    }, (error) => setProblem(errorMessage(error)));
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [store, attempt.id]);

  async function saveNote() {
    if (note === attempt.note) return;
    try {
      await store.updateNote(attempt.id, note);
    } catch (error) {
      setProblem(errorMessage(error));
    }
  }

  async function remove() {
    if (!window.confirm(`${attempt.attemptNo}번째 답변을 삭제할까요?`)) return;
    await store.deleteAttempt(attempt.id);
    await onChanged();
  }

  const label = `${attempt.attemptNo}번째 답변 · ${formatDuration(attempt.durationMs)}`;
  return (
    <div className="attempt" data-attempt-no={attempt.attemptNo}>
      <p className="attempt-title">{label} · {formatDate(attempt.createdAt)}</p>
      {url && <audio controls src={url} aria-label={label} />}
      <div className="actions">
        {url && <a href={url} download={`answer-${attempt.questionId}-${attempt.attemptNo}.${extensionFor(attempt.mimeType)}`}>음성 파일 받기</a>}
        <button type="button" className="danger" onClick={remove}>답변 삭제</button>
      </div>
      <label>
        자가 메모
        <textarea value={note} onChange={(event) => setNote(event.target.value)} onBlur={saveNote} rows={2} />
      </label>
      {problem && <p className="error" role="alert">{problem}</p>}
    </div>
  );
}
