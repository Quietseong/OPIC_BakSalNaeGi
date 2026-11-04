import { useState } from "react";

import { COACHING } from "../domain/coaching";
import { CoachingCard } from "./CoachingCard";
import { ModelAnswerPanel } from "./ModelAnswerPanel";

import type { Question } from "../domain/types";

export function StudyStep({ question, onNext }: { question: Question; onNext: () => void }) {
  return (
    <section className="card">
      <h2>1단계 · 모범 답안 공부</h2>
      <p className="prompt" lang="en">{question.prompt}</p>
      <ol className="study-guide">
        <li>모범 답안을 들으며 눈으로 따라 읽습니다.</li>
        <li>한 번 더 들으며 소리 내어 바로 따라 말합니다(섀도잉). 막히는 곳은 멈추고 되감으세요.</li>
        <li>내 이야기에도 쓸 수 있는 표현 2~3개를 골라 둡니다.</li>
      </ol>
      <ModelAnswerPanel questionId={question.id} isOpen />
      <div className="actions">
        <button type="button" className="primary" onClick={onNext}>내 이야기로 바꾸기</button>
      </div>
    </section>
  );
}

export function PlanStep({ question, onDone }: { question: Question; onDone: (plan: string[]) => void }) {
  const steps = COACHING[question.type].skeleton;
  const [plan, setPlan] = useState<string[]>(() => steps.map(() => ""));
  return (
    <section className="card">
      <h2>2단계 · 내 키워드 메모</h2>
      <p className="prompt" lang="en">{question.prompt}</p>
      <p className="muted">
        문장으로 쓰지 말고 단어만 적으세요. 한국어도 괜찮습니다. 예: "작년 가을, 민지랑, 연남동 카페, 비 옴, 우산 없음".
        녹음할 때 이 메모만 보고 말합니다.
      </p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onDone(plan.map((item) => item.trim()));
        }}
      >
        {steps.map((step, index) => (
          <label key={step}>
            {index + 1}. {step}
            <input
              type="text"
              value={plan[index] ?? ""}
              onChange={(event) => setPlan((current) => current.map((item, at) => (at === index ? event.target.value : item)))}
            />
          </label>
        ))}
        <CoachingCard type={question.type} />
        <div className="actions">
          <button type="submit" className="primary">녹음하러 가기</button>
        </div>
      </form>
    </section>
  );
}

export function PlanBox({ question, plan }: { question: Question; plan: string[] }) {
  const steps = COACHING[question.type].skeleton;
  if (plan.every((item) => item === "")) return null;
  return (
    <aside className="plan-box" aria-label="내 키워드 메모">
      <h3>내 키워드 메모</h3>
      <ol>
        {steps.map((step, index) => (
          <li key={step}>
            <span className="muted">{step} · </span>
            {plan[index] || "—"}
          </li>
        ))}
      </ol>
    </aside>
  );
}
