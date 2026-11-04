import { firstSessionLength } from "../domain/session";

import type { Session } from "../domain/types";

type Props = { session: Session; answeredIds: Set<string> };

export function QuestionGrid({ session, answeredIds }: Props) {
  const firstLength = firstSessionLength(session);
  const isSecondPending = session.difficulty === null;
  return (
    <nav className="grid-panel" aria-label="문항 진행">
      <ol className="question-grid">
        {session.questionIds.map((questionId, index) => {
          const isCurrent = session.status === "in-progress" && index === session.currentIndex;
          const isDone = answeredIds.has(questionId);
          const className = ["tile", isDone ? "is-done" : "", isCurrent ? "is-current" : "", index === firstLength ? "starts-second" : ""]
            .filter(Boolean)
            .join(" ");
          return (
            <li key={questionId} className={className} aria-current={isCurrent ? "step" : undefined}>
              <span className="tile-number">{index + 1}</span>
              <span className="sr-only">{isDone ? " 답변 완료" : " 미답변"}</span>
            </li>
          );
        })}
      </ol>
      {isSecondPending && <p className="muted grid-note">2차 세션 문항은 난이도 선택 후 표시됩니다.</p>}
    </nav>
  );
}
