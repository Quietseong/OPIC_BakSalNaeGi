import { useEffect, useState } from "react";

import { PRACTICE_SET_A } from "../domain/question-sets";
import { createSession } from "../domain/session";
import { PracticeStore } from "../storage/db";
import { errorMessage } from "./format";
import { Home } from "./Home";
import { MicCheck } from "./MicCheck";
import { Review } from "./Review";
import { Runner } from "./Runner";

import type { SessionSettings } from "../domain/types";

type View =
  | { kind: "home" }
  | { kind: "mic-check"; settings: SessionSettings }
  | { kind: "run"; sessionId: string }
  | { kind: "review"; sessionId: string };

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
    const session = createSession(PRACTICE_SET_A, settings, { id: crypto.randomUUID(), now: Date.now() });
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
        />
      );
    case "mic-check":
      return <MicCheck onReady={() => void start(view.settings)} onBack={home} />;
    case "run":
      return <Runner store={store} sessionId={view.sessionId} onHome={home} onReview={(sessionId) => setView({ kind: "review", sessionId })} />;
    case "review":
      return <Review store={store} sessionId={view.sessionId} onHome={home} />;
  }
}
