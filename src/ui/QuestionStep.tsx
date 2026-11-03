import { useEffect, useReducer, useRef, useState } from "react";

import { INITIAL_RUNNER_STATE, canAdvance, canListen, canRecord, runnerReducer } from "../domain/runner";
import { requestMic, startRecording } from "../media/recorder";
import { playQuestion, stopSpeaking } from "../media/speech";
import { errorMessage, formatDuration } from "./format";

import type { RunnerRules, RunnerState } from "../domain/runner";
import type { Recording, RecordingHandle } from "../media/recorder";
import type { Question } from "../domain/types";

type Props = {
  question: Question;
  heading: string;
  rules: RunnerRules & { showPromptText: boolean };
  practiceTargetSec: number | null;
  alreadySaved: boolean;
  timeUp?: boolean;
  onSave: (recording: Recording) => Promise<void>;
  onNext?: () => void;
  onTimeUpHandled?: () => void;
};

const STATUS_TEXT: Record<RunnerState["kind"], string> = {
  ready: "질문 듣기를 눌러 시작하세요.",
  playing: "질문을 재생하고 있습니다.",
  answerable: "준비되면 녹음 시작을 누르세요.",
  recording: "녹음 중입니다.",
  saving: "답변을 저장하고 있습니다.",
  saved: "답변이 저장되었습니다.",
  "save-failed": "답변을 저장하지 못했습니다.",
};

function initialState(alreadySaved: boolean, maxListens: number | null): RunnerState {
  return alreadySaved ? { kind: "saved", listens: maxListens ?? 0 } : INITIAL_RUNNER_STATE;
}

function useElapsed(active: boolean): number {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!active) return;
    const startedAt = Date.now();
    setElapsed(0);
    const timer = setInterval(() => setElapsed(Date.now() - startedAt), 250);
    return () => clearInterval(timer);
  }, [active]);
  return elapsed;
}

export function QuestionStep(props: Props) {
  const { question, rules } = props;
  const [state, dispatchRaw] = useReducer(
    (current: RunnerState, event: Parameters<typeof runnerReducer>[1]) => runnerReducer(current, event, rules),
    initialState(props.alreadySaved, rules.maxListens),
  );
  const [problem, setProblem] = useState<string | null>(null);
  const handleRef = useRef<RecordingHandle | null>(null);
  const pendingRef = useRef<Recording | null>(null);
  const elapsed = useElapsed(state.kind === "recording");

  useEffect(() => () => {
    stopSpeaking();
    void handleRef.current?.stop().catch(() => undefined);
  }, []);

  async function save(recording: Recording) {
    try {
      await props.onSave(recording);
      pendingRef.current = null;
      dispatchRaw({ type: "SAVE_OK" });
    } catch (error) {
      dispatchRaw({ type: "SAVE_FAILED", message: errorMessage(error) });
    }
  }

  async function handlePlay() {
    setProblem(null);
    dispatchRaw({ type: "PLAY" });
    try {
      await playQuestion(question);
      dispatchRaw({ type: "PLAY_ENDED" });
    } catch (error) {
      setProblem(`${errorMessage(error)} 질문 텍스트를 보고 답변하세요.`);
      dispatchRaw({ type: "PLAY_FAILED" });
    }
  }

  async function handleRecord() {
    setProblem(null);
    dispatchRaw({ type: "RECORD" });
    try {
      handleRef.current = startRecording(await requestMic());
    } catch (error) {
      setProblem(errorMessage(error));
      dispatchRaw({ type: "RECORD_FAILED" });
    }
  }

  async function handleStop() {
    const handle = handleRef.current;
    if (!handle) return;
    handleRef.current = null;
    dispatchRaw({ type: "STOP" });
    try {
      const recording = await handle.stop();
      pendingRef.current = recording;
      await save(recording);
    } catch (error) {
      dispatchRaw({ type: "SAVE_FAILED", message: errorMessage(error) });
    }
  }

  async function handleRetry() {
    const recording = pendingRef.current;
    if (!recording) return;
    dispatchRaw({ type: "RETRY_SAVE" });
    await save(recording);
  }

  const timeUpRef = useRef(false);
  useEffect(() => {
    if (!props.timeUp || timeUpRef.current) return;
    timeUpRef.current = true;
    stopSpeaking();
    void (state.kind === "recording" ? handleStop() : Promise.resolve()).then(() => props.onTimeUpHandled?.());
  });

  const showPrompt = rules.showPromptText || (state.kind === "answerable" && state.playbackFailed);
  const listensLabel = rules.maxListens === null ? `${state.listens}회` : `${state.listens}/${rules.maxListens}`;

  return (
    <section className="card" aria-labelledby="question-heading">
      <h2 id="question-heading">{props.heading}</h2>
      <p className="topic">주제: {question.topic}</p>
      {showPrompt ? <p className="prompt" lang="en">{question.prompt}</p> : <p className="prompt muted">질문을 듣고 답하세요.</p>}
      <div className="actions">
        <button type="button" onClick={handlePlay} disabled={!canListen(state, rules)}>
          질문 듣기 ({listensLabel})
        </button>
        {state.kind === "recording" ? (
          <button type="button" className="danger" onClick={handleStop}>녹음 정지</button>
        ) : (
          <button type="button" className="primary" onClick={handleRecord} disabled={!canRecord(state)}>녹음 시작</button>
        )}
        {state.kind === "save-failed" && <button type="button" onClick={handleRetry}>저장 다시 시도</button>}
        {state.kind === "saved" && rules.allowRerecord && (
          <button type="button" onClick={() => dispatchRaw({ type: "RERECORD" })}>다시 녹음</button>
        )}
        {props.onNext && (
          <button type="button" className="primary" onClick={props.onNext} disabled={!canAdvance(state)}>다음 문항</button>
        )}
      </div>
      {state.kind === "recording" && <RecordingClock elapsed={elapsed} targetSec={props.practiceTargetSec} />}
      <p className="status" role="status" aria-live="polite" data-state={state.kind}>{STATUS_TEXT[state.kind]}</p>
      {state.kind === "save-failed" && <p className="error" role="alert">{state.message}</p>}
      {problem && <p className="error" role="alert">{problem}</p>}
    </section>
  );
}

function RecordingClock({ elapsed, targetSec }: { elapsed: number; targetSec: number | null }) {
  const reached = targetSec !== null && elapsed >= targetSec * 1000;
  return (
    <p className="clock">
      경과 {formatDuration(elapsed)}
      {targetSec !== null && ` / 연습 목표 ${formatDuration(targetSec * 1000)}`}
      {reached && " · 목표 도달 (자동으로 끊지 않습니다)"}
    </p>
  );
}
