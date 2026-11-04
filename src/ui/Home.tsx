import { useEffect, useState } from "react";

import { MIN_SURVEY_TOPICS } from "../domain/generate";
import { errorMessage, formatDate } from "./format";
import { SurveyFields } from "./SurveyFields";

import type { PracticeStore } from "../storage/db";
import type { Mode, PracticeTargetSec, SelfAssessment, Session, SessionSettings } from "../domain/types";

type Props = {
  store: PracticeStore;
  onStart: (settings: SessionSettings) => void;
  onResume: (sessionId: string) => void;
  onReview: (sessionId: string) => void;
};

function usePersistence(): string {
  const [text, setText] = useState("확인 중");
  useEffect(() => {
    if (!navigator.storage?.persist) return setText("지원 안 됨");
    void navigator.storage.persist().then((granted) => setText(granted ? "보호됨" : "보호 안 됨"));
  }, []);
  return text;
}

export function Home({ store, onStart, onResume, onReview }: Props) {
  const [mode, setMode] = useState<Mode>("practice");
  const [target, setTarget] = useState<PracticeTargetSec>(120);
  const [topicIds, setTopicIds] = useState<string[]>([]);
  const [selfAssessment, setSelfAssessment] = useState<SelfAssessment>(3);
  const hasEnoughTopics = topicIds.length >= MIN_SURVEY_TOPICS;
  const [sessions, setSessions] = useState<Session[]>([]);
  const [error, setError] = useState<string | null>(null);
  const persistence = usePersistence();

  useEffect(() => {
    store.listSessions().then(setSessions, (loadError) => setError(errorMessage(loadError)));
  }, [store]);

  return (
    <main>
      <h1>OPIc 말하기 연습</h1>
      <form
        className="card"
        onSubmit={(event) => {
          event.preventDefault();
          if (!hasEnoughTopics) return;
          onStart({ mode, practiceTargetSec: mode === "practice" ? target : null, topicIds, selfAssessment });
        }}
      >
        <fieldset>
          <legend>모드</legend>
          <label>
            <input type="radio" name="mode" checked={mode === "practice"} onChange={() => setMode("practice")} />
            연습 모드 · 질문 텍스트 표시, 다시 듣기 제한 없음, 다시 녹음 가능, 수준에 따라 12~15문항
          </label>
          <label>
            <input type="radio" name="mode" checked={mode === "exam"} onChange={() => setMode("exam")} />
            실전 모드 · 질문 텍스트 숨김, 질문 청취 2회, 전체 40분, 7번 뒤 난이도 재선택
          </label>
        </fieldset>
        {mode === "practice" && (
          <label>
            연습 목표 시간 (자동으로 끊지 않음)
            <select value={String(target)} onChange={(event) => setTarget(event.target.value === "none" ? null : (Number(event.target.value) as 90 | 120))}>
              <option value="none">없음</option>
              <option value="90">90초</option>
              <option value="120">120초</option>
            </select>
          </label>
        )}
        {mode === "exam" && (
          <p className="muted">
            공식 안내로 확인한 규칙: 질문 청취 2회, 문항별 답변시간 제한 없음, 본시험 40분, 1차 약 7문항 뒤 난이도 재조정.
            앱 자체 규칙: 다시 듣기는 녹음 전에만 가능, 이전 문항으로 돌아갈 수 없음, 40분이 지나면 녹음 중인 답변을 저장하고 종료.
          </p>
        )}
        <SurveyFields
          topicIds={topicIds}
          selfAssessment={selfAssessment}
          onTopicsChange={setTopicIds}
          onSelfAssessmentChange={setSelfAssessment}
        />
        <p className="muted">문항은 매번 주제별 문항 풀에서 새로 조합됩니다.</p>
        <button type="submit" className="primary" disabled={!hasEnoughTopics}>마이크 점검 후 시작</button>
        {!hasEnoughTopics && <p className="muted" role="status">관심 주제를 {MIN_SURVEY_TOPICS}개 이상 고르면 시작할 수 있습니다.</p>}
      </form>
      <p className="muted">
        녹음은 이 브라우저에만 저장됩니다. 저장소 보호: {persistence}. 브라우저 데이터를 지우면 녹음도 사라지므로 복기 화면에서 내보내 두세요.
      </p>
      {error && <p className="error" role="alert">{error}</p>}
      <SessionList sessions={sessions} onResume={onResume} onReview={onReview} />
    </main>
  );
}

function SessionList({ sessions, onResume, onReview }: { sessions: Session[]; onResume: (id: string) => void; onReview: (id: string) => void }) {
  if (sessions.length === 0) return null;
  return (
    <section className="card">
      <h2>연습 기록</h2>
      <ul className="session-list">
        {sessions.map((session) => (
          <li key={session.id}>
            <span>
              {formatDate(session.startedAt)} · {session.settings.mode === "exam" ? "실전" : "연습"} ·{" "}
              {session.status === "completed" ? "완료" : `${session.currentIndex + 1}번 문항 진행 중`}
            </span>
            {session.status === "in-progress" && <button type="button" onClick={() => onResume(session.id)}>이어하기</button>}
            <button type="button" onClick={() => onReview(session.id)}>복기</button>
          </li>
        ))}
      </ul>
    </section>
  );
}
