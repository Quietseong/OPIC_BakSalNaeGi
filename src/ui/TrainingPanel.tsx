import { useEffect, useState } from "react";

import { findQuestion } from "../domain/questions";
import { dueCards } from "../domain/review-schedule";
import { errorMessage, formatDate } from "./format";

import type { PracticeStore } from "../storage/db";
import type { ReviewCard, TrainingRecord } from "../domain/types";

type Props = {
  store: PracticeStore;
  onTrain: (questionId: string | null) => void;
  onTrainingResult: (trainingId: string) => void;
};

const RECENT_LIMIT = 5;

export function TrainingPanel({ store, onTrain, onTrainingResult }: Props) {
  const [due, setDue] = useState<ReviewCard[]>([]);
  const [trainings, setTrainings] = useState<TrainingRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([store.listReviewCards(), store.listTrainings()]).then(
      ([cards, records]) => {
        setDue(dueCards(cards, Date.now()));
        setTrainings(records.slice(0, RECENT_LIMIT));
      },
      (loadError) => setError(errorMessage(loadError)),
    );
  }, [store]);

  return (
    <section className="card">
      <h2>훈련</h2>
      <p className="muted">모의고사는 실력을 재는 도구입니다. 실력은 같은 질문을 반복해 고쳐 말하면서 늘어납니다.</p>
      <div className="actions">
        <button type="button" className="primary" onClick={() => onTrain(null)}>새 질문으로 3번 줄여 말하기</button>
      </div>
      <h3>오늘 복습할 질문 {due.length}개</h3>
      {due.length === 0 && <p className="muted">복기 화면에서 "복습 목록에 넣기"를 누르거나 훈련 후 평가하면 여기에 나옵니다.</p>}
      <ul className="session-list">
        {due.map((card) => (
          <li key={card.questionId}>
            <span lang="en">{findQuestion(card.questionId)?.prompt.slice(0, 70) ?? card.questionId}…</span>
            <button type="button" onClick={() => onTrain(card.questionId)}>복습하기</button>
          </li>
        ))}
      </ul>
      {trainings.length > 0 && (
        <>
          <h3>최근 훈련</h3>
          <ul className="session-list">
            {trainings.map((record) => (
              <li key={record.id}>
                <span>{formatDate(record.createdAt)} · {findQuestion(record.questionId)?.topic ?? record.questionId}</span>
                <button type="button" onClick={() => onTrainingResult(record.id)}>결과 보기</button>
              </li>
            ))}
          </ul>
        </>
      )}
      {error && <p className="error" role="alert">{error}</p>}
    </section>
  );
}
