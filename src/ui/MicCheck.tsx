import { useEffect, useState } from "react";

import { requestMic, startRecording } from "../media/recorder";
import { errorMessage } from "./format";

type Props = { onReady: () => void; onBack: () => void };

const TEST_MS = 3000;

type CheckState =
  | { kind: "idle" }
  | { kind: "recording" }
  | { kind: "done"; url: string }
  | { kind: "failed"; message: string };

export function MicCheck({ onReady, onBack }: Props) {
  const [check, setCheck] = useState<CheckState>({ kind: "idle" });

  useEffect(() => () => {
    if (check.kind === "done") URL.revokeObjectURL(check.url);
  }, [check]);

  async function runTest() {
    setCheck({ kind: "recording" });
    try {
      const handle = startRecording(await requestMic());
      await new Promise((resolve) => setTimeout(resolve, TEST_MS));
      const recording = await handle.stop();
      setCheck({ kind: "done", url: URL.createObjectURL(recording.blob) });
    } catch (error) {
      setCheck({ kind: "failed", message: errorMessage(error) });
    }
  }

  return (
    <main>
      <h1>마이크 점검</h1>
      <section className="card">
        <p>3초 동안 아무 말이나 녹음한 뒤 들어 보세요. 소리가 잘 들리면 시작합니다.</p>
        <div className="actions">
          <button type="button" onClick={runTest} disabled={check.kind === "recording"}>
            {check.kind === "recording" ? "녹음 중…" : "3초 테스트 녹음"}
          </button>
          <button type="button" className="primary" onClick={onReady} disabled={check.kind !== "done"}>
            연습 시작
          </button>
          <button type="button" onClick={onBack}>뒤로</button>
        </div>
        {check.kind === "done" && <audio controls src={check.url} aria-label="테스트 녹음" />}
        {check.kind === "failed" && <p className="error" role="alert">{check.message}</p>}
        <p className="muted" role="status" aria-live="polite">
          {check.kind === "done" ? "테스트 녹음이 준비되었습니다." : ""}
        </p>
      </section>
    </main>
  );
}
