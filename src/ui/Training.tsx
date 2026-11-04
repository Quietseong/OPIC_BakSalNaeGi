import { useCallback, useEffect, useState } from "react";

import { newAttempt } from "../domain/attempt";
import { COACHING } from "../domain/coaching";
import { allPoolQuestions } from "../domain/generate";
import { QUESTION_POOL } from "../domain/question-pool-data";
import { findQuestion } from "../domain/questions";
import { scheduleReview } from "../domain/review-schedule";
import { newTraining, trainableQuestions } from "../domain/training";
import { AttemptRow } from "./AttemptRow";
import { CoachingCard } from "./CoachingCard";
import { errorMessage, formatDate } from "./format";
import { QuestionStep } from "./QuestionStep";

import type { Recording } from "../media/recorder";
import type { PracticeStore } from "../storage/db";
import type { ReviewOutcome } from "../domain/review-schedule";
import type { Attempt, Question, TrainingRecord } from "../domain/types";

type Props = { store: PracticeStore; start: { questionId: string | null } | { trainingId: string }; onHome: () => void };

type Stage =
  | { kind: "pick"; questionId: string }
  | { kind: "round"; record: TrainingRecord; round: number }
  | { kind: "result"; record: TrainingRecord };

const POOL = trainableQuestions(allPoolQuestions(QUESTION_POOL));

function randomQuestionId(exceptId?: string): string {
  const candidates = POOL.filter((question) => question.id !== exceptId);
  return candidates[Math.floor(Math.random() * candidates.length)]?.id ?? POOL[0]?.id ?? "";
}

const PRACTICE_RULES = { maxListens: null, showPromptText: true, allowRerecord: false };

export function Training({ store, start, onHome }: Props) {
  const [stage, setStage] = useState<Stage | null>(() =>
    "questionId" in start ? { kind: "pick", questionId: start.questionId ?? randomQuestionId() } : null,
  );
  const [error, setError] = useState<string | null>(null);
  const trainingId = "trainingId" in start ? start.trainingId : null;

  useEffect(() => {
    if (trainingId === null) return;
    store.getTraining(trainingId).then(
      (record) => (record ? setStage({ kind: "result", record }) : setError("훈련 기록을 찾을 수 없습니다.")),
      (loadError) => setError(errorMessage(loadError)),
    );
  }, [store, trainingId]);

  async function begin(questionId: string) {
    const record = newTraining(questionId, { id: crypto.randomUUID(), now: Date.now() });
    try {
      await store.saveTraining(record);
      setStage({ kind: "round", record, round: 0 });
    } catch (saveError) {
      setError(errorMessage(saveError));
    }
  }

  if (error) return <main><p className="error" role="alert">{error}</p><button type="button" onClick={onHome}>처음으로</button></main>;
  if (!stage) return <p role="status">불러오는 중…</p>;
  const questionId = stage.kind === "pick" ? stage.questionId : stage.record.questionId;
  const question = findQuestion(questionId);
  if (!question) return <p className="error" role="alert">문항을 찾을 수 없습니다: {questionId}</p>;

  return (
    <main>
      <header className="run-header">
        <h1>훈련 · 3번 줄여 말하기</h1>
        <button type="button" onClick={onHome}>처음으로</button>
      </header>
      {stage.kind === "pick" && (
        <PickStep
          question={question}
          canShuffle={"questionId" in start && start.questionId === null}
          onShuffle={() => setStage({ kind: "pick", questionId: randomQuestionId(question.id) })}
          onBegin={() => void begin(question.id)}
        />
      )}
      {stage.kind === "round" && <RoundStep store={store} question={question} record={stage.record} round={stage.round} onStage={setStage} />}
      {stage.kind === "result" && <ResultStep store={store} question={question} record={stage.record} onAgain={() => setStage({ kind: "pick", questionId: randomQuestionId(question.id) })} />}
    </main>
  );
}

function PickStep({ question, canShuffle, onShuffle, onBegin }: { question: Question; canShuffle: boolean; onShuffle: () => void; onBegin: () => void }) {
  return (
    <section className="card">
      <p className="muted">
        같은 질문에 90초 → 70초 → 50초 제한으로 세 번 답합니다. 같은 내용을 점점 짧은 시간에, 덜 끊기게 말하는 유창성 훈련입니다.
        제한 시간이 되면 녹음이 자동으로 멈춥니다.
      </p>
      <h2>{question.topic} · {COACHING[question.type].label}</h2>
      <p className="prompt" lang="en">{question.prompt}</p>
      <CoachingCard type={question.type} />
      <div className="actions">
        {canShuffle && <button type="button" onClick={onShuffle}>다른 질문</button>}
        <button type="button" className="primary" onClick={onBegin}>훈련 시작</button>
      </div>
    </section>
  );
}

type RoundProps = { store: PracticeStore; question: Question; record: TrainingRecord; round: number; onStage: (stage: Stage) => void };

function RoundStep({ store, question, record, round, onStage }: RoundProps) {
  const limit = record.roundLimitsSec[round] ?? 60;
  const isLast = round >= record.roundLimitsSec.length - 1;

  async function save(recording: Recording) {
    const attempt = newAttempt(
      { sessionId: record.id, questionId: question.id, attemptNo: round + 1, mimeType: recording.mimeType, durationMs: recording.durationMs, sizeBytes: recording.blob.size },
      { id: crypto.randomUUID(), now: Date.now() },
    );
    await store.saveAttempt(attempt, recording.blob);
  }

  return (
    <QuestionStep
      key={`${record.id}-${round}`}
      question={question}
      heading={`${round + 1}라운드 · 제한 ${limit}초`}
      rules={PRACTICE_RULES}
      practiceTargetSec={null}
      hardLimitSec={limit}
      showCoaching
      alreadySaved={false}
      onSave={save}
      nextLabel={isLast ? "결과 보기" : "다음 라운드"}
      onNext={() => onStage(isLast ? { kind: "result", record } : { kind: "round", record, round: round + 1 })}
    />
  );
}

function ResultStep({ store, question, record, onAgain }: { store: PracticeStore; question: Question; record: TrainingRecord; onAgain: () => void }) {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [nextReview, setNextReview] = useState<number | null>(null);
  const reload = useCallback(async () => setAttempts(await store.listAttempts(record.id)), [store, record.id]);
  useEffect(() => void reload(), [reload]);

  async function rate(outcome: ReviewOutcome) {
    const card = scheduleReview(await store.getReviewCard(question.id), question.id, outcome, Date.now());
    await store.saveReviewCard(card);
    setNextReview(card.dueAt);
  }

  return (
    <section className="card">
      <h2>세 번의 답변 비교</h2>
      <p className="prompt" lang="en">{question.prompt}</p>
      <p className="muted">세 녹음을 차례로 들어 보세요. 뒤로 갈수록 덜 끊기고 같은 표현이 빨리 나오면 잘 된 것입니다. 받아쓰고 고친 문장을 적어 두면 복습 때 보입니다.</p>
      {attempts.map((attempt) => (
        <AttemptRow key={attempt.id} store={store} attempt={attempt} title={`${attempt.attemptNo}라운드 (${record.roundLimitsSec[attempt.attemptNo - 1] ?? "?"}초)`} onChanged={reload} />
      ))}
      <h3>이 질문, 어땠나요?</h3>
      <div className="actions">
        <button type="button" onClick={() => void rate("stuck")} disabled={nextReview !== null}>막혔어요 (내일 다시)</button>
        <button type="button" onClick={() => void rate("good")} disabled={nextReview !== null}>잘 됐어요 (간격 늘리기)</button>
        <button type="button" onClick={onAgain}>다른 질문으로 훈련</button>
      </div>
      {nextReview !== null && <p role="status">{formatDate(nextReview)}에 복습 목록에 다시 나옵니다.</p>}
    </section>
  );
}
