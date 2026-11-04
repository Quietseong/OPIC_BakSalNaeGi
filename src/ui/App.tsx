import { useEffect, useState } from "react";

import { generatePlan } from "../domain/generate";
import { QUESTION_POOL } from "../domain/question-pool-data";
import { createSession } from "../domain/session";
import { PracticeStore } from "../storage/db";
import { errorMessage } from "./format";
import { Home } from "./Home";
import { MicCheck } from "./MicCheck";
import { Review } from "./Review";
import { Runner } from "./Runner";
import { Training } from "./Training";

import type { SessionSettings } from "../domain/types";

type View =
  | { kind: "home" }
  | { kind: "mic-check"; settings: SessionSettings }
  | { kind: "run"; sessionId: string }
  | { kind: "review"; sessionId: string }
  | { kind: "training"; questionId: string | null }
  | { kind: "training-result"; trainingId: string };

export function App() {
  const [store, setStore] = useState<PracticeStore | null>(null);
  const [view, setView] = useState<View>({ kind: "home" });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    PracticeStore.open().then(setStore, (openError) => setError(errorMessage(openError)));
  }, []);

  if (error) return <p className="error" role="alert">저장소를 열지 못했습니다. {error}</p>;
  if (!store) return <p role="status">불러오는 중…</p>;

  async function start(settings: SessionSettings) {
    if (!store) return;
    const plan = generatePlan(QUESTION_POOL, settings, Math.random);
    const session = createSession(plan, settings, { id: crypto.randomUUID(), now: Date.now(), poolVersion: QUESTION_POOL.version });
    try {
      await store.saveSession(session);
      setView({ kind: "run", sessionId: session.id });
    } catch (saveError) {
      setError(errorMessage(saveError));
    }
  }

  const home = () => setView({ kind: "home" });
  switch (view.kind) {
    case "home":
      return (
        <Home
          store={store}
          onStart={(settings) => setView({ kind: "mic-check", settings })}
          onResume={(sessionId) => setView({ kind: "run", sessionId })}
          onReview={(sessionId) => setView({ kind: "review", sessionId })}
          onTrain={(questionId) => setView({ kind: "training", questionId })}
          onTrainingResult={(trainingId) => setView({ kind: "training-result", trainingId })}
        />
      );
    case "mic-check":
      return <MicCheck onReady={() => void start(view.settings)} onBack={home} />;
    case "run":
      return <Runner store={store} sessionId={view.sessionId} onHome={home} onReview={(sessionId) => setView({ kind: "review", sessionId })} />;
    case "review":
      return <Review store={store} sessionId={view.sessionId} onHome={home} />;
    case "training":
      return <Training key={view.questionId ?? "random"} store={store} start={{ questionId: view.questionId }} onHome={home} />;
    case "training-result":
      return <Training key={view.trainingId} store={store} start={{ trainingId: view.trainingId }} onHome={home} />;
  }
}
