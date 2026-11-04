import { useEffect, useState } from "react";

import { errorMessage, formatDate, formatDuration } from "./format";

import type { PracticeStore } from "../storage/db";
import type { Attempt, AttemptText } from "../domain/types";

type Props = {
  store: PracticeStore;
  attempt: Attempt;
  title?: string;
  onChanged: () => Promise<void>;
};

const TEXT_FIELDS: { key: keyof AttemptText; label: string; hint: string }[] = [
  { key: "transcript", label: "받아쓰기 · 내가 실제로 한 말", hint: "녹음을 들으며 '음', 끊긴 곳까지 그대로 적으세요." },
  { key: "revised", label: "고친 문장 · 다음에 이렇게 말하기", hint: "시제, 빠진 단어, 어색한 표현을 고쳐 적고 다시 답변해 보세요." },
  { key: "note", label: "자가 메모", hint: "" },
];

function extensionFor(mimeType: string): string {
  return mimeType.includes("mp4") ? "m4a" : "webm";
}

function useRecordingUrl(store: PracticeStore, attemptId: string, onError: (message: string) => void): string | null {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let objectUrl: string | null = null;
    void store.getRecording(attemptId).then((blob) => {
      if (!blob) return onError("녹음 파일을 찾을 수 없습니다.");
      objectUrl = URL.createObjectURL(blob);
      setUrl(objectUrl);
    }, (error) => onError(errorMessage(error)));
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [store, attemptId, onError]);
  return url;
}

export function AttemptRow({ store, attempt, title, onChanged }: Props) {
  const [problem, setProblem] = useState<string | null>(null);
  const [texts, setTexts] = useState<AttemptText>({ note: attempt.note, transcript: attempt.transcript, revised: attempt.revised });
  const url = useRecordingUrl(store, attempt.id, setProblem);

  async function saveField(key: keyof AttemptText) {
    if (texts[key] === attempt[key]) return;
    try {
      await store.updateAttemptText(attempt.id, { [key]: texts[key] });
      await onChanged();
    } catch (error) {
      setProblem(errorMessage(error));
    }
  }

  async function remove() {
    if (!window.confirm(`${attempt.attemptNo}번째 답변을 삭제할까요?`)) return;
    await store.deleteAttempt(attempt.id);
    await onChanged();
  }

  const label = `${title ?? `${attempt.attemptNo}번째 답변`} · ${formatDuration(attempt.durationMs)}`;
  return (
    <div className="attempt" data-attempt-no={attempt.attemptNo}>
      <p className="attempt-title">{label} · {formatDate(attempt.createdAt)}</p>
      {url && <audio controls src={url} aria-label={label} />}
      <div className="actions">
        {url && <a href={url} download={`answer-${attempt.questionId}-${attempt.attemptNo}.${extensionFor(attempt.mimeType)}`}>음성 파일 받기</a>}
        <button type="button" className="danger" onClick={remove}>답변 삭제</button>
      </div>
      {TEXT_FIELDS.map((field) => (
        <label key={field.key}>
          {field.label}
          {field.hint && <span className="muted field-hint">{field.hint}</span>}
          <textarea
            value={texts[field.key]}
            onChange={(event) => setTexts((current) => ({ ...current, [field.key]: event.target.value }))}
            onBlur={() => void saveField(field.key)}
            rows={2}
            lang={field.key === "note" ? undefined : "en"}
          />
        </label>
      ))}
      {problem && <p className="error" role="alert">{problem}</p>}
    </div>
  );
}
