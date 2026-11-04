import { COACHING } from "../domain/coaching";

import type { QuestionType } from "../domain/types";

export function CoachingCard({ type }: { type: QuestionType }) {
  const coaching = COACHING[type];
  return (
    <details className="coaching" open>
      <summary>답변 뼈대 · {coaching.label} 유형</summary>
      <ol className="skeleton">
        {coaching.skeleton.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <p className="muted">덩어리 표현 · 통째로 외워 두고, 빈칸은 내 경험으로 채우세요. 답변 전체를 외우면 안 됩니다.</p>
      <ul className="chunks">
        {coaching.chunks.map((chunk) => (
          <li key={chunk.en}>
            <span lang="en">{chunk.en}</span>
            <span className="muted"> {chunk.ko}</span>
          </li>
        ))}
      </ul>
    </details>
  );
}
