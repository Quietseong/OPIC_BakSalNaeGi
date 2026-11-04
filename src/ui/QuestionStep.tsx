import { useEffect, useReducer, useRef, useState } from "react";

import { INITIAL_RUNNER_STATE, canAdvance, canListen, canPause, canRecord, isCapturing, runnerReducer } from "../domain/runner";
import { requestMic, startRecording } from "../media/recorder";
import { playQuestion, stopSpeaking } from "../media/speech";
import { errorMessage, formatDuration } from "./format";
import { CoachingCard } from "./CoachingCard";
import { LevelMeter } from "./LevelMeter";

import type { RunnerRules, RunnerState } from "../domain/runner";
import type { Recording, RecordingHandle } from "../media/recorder";
import type { Question } from "../domain/types";

type Props = {
  question: Question;
  heading: string;
  rules: RunnerRules & { showPromptText: boolean };
  practiceTargetSec: number | null;
  hardLimitSec?: number;
  showCoaching?: boolean;
  nextLabel?: string;
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
  paused: "일시정지했습니다. 생각을 정리한 뒤 이어서 녹음하세요.",
  saving: "답변을 저장하고 있습니다.",
  saved: "답변이 저장되었습니다.",
  "save-failed": "답변을 저장하지 못했습니다.",
};

function initialState(alreadySaved: boolean, maxListens: number | null): RunnerState {
  return alreadySaved ? { kind: "saved", listens: maxListens ?? 0 } : INITIAL_RUNNER_STATE;
}

// Counts only recording time: paused stretches are excluded, and a new capture starts from zero.
function useRecordingElapsed(kind: RunnerState["kind"]): number {
  const [elapsed, setElapsed] = useState(0);
  const banked = useRef(0);
  const isCapturing = kind === "recording" || kind === "paused";
  useEffect(() => {
    if (!isCapturing) banked.current = 0;
    if (kind !== "recording") return;
    const startedAt = Date.now();
    const base = banked.current;
    setElapsed(base);
    const timer = setInterval(() => setElapsed(base + Date.now() - startedAt), 250);
    return () => {
      clearInterval(timer);
      banked.current = base + Date.now() - startedAt;
    };
  }, [kind, isCapturing]);
  return elapsed;
}

export function QuestionStep(props: Props) {
  const { question, rules } = props;
  const [state, dispatchRaw] = useReducer(
    (current: RunnerState, event: Parameters<typeof runnerReducer>[1]) => runnerReducer(current, event, rules),
    initialState(props.alreadySaved, rules.maxListens),
  );
  const [problem, setProblem] = useState<string | null>(null);
  const [liveStream, setLiveStream] = useState<MediaStream | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const handleRef = useRef<RecordingHandle | null>(null);
  const pendingRef = useRef<Recording | null>(null);
  const elapsed = useRecordingElapsed(state.kind);
  const mountedRef = useRef(true);
  const onSaveRef = useRef(props.onSave);
  onSaveRef.current = props.onSave;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      stopSpeaking();
      const handle = handleRef.current;
      handleRef.current = null;
      // Leaving mid-answer keeps the recording instead of discarding it.
      void handle?.stop().then(onSaveRef.current).catch((error) => console.error("answer not saved on exit", error));
    };
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
      const stream = await requestMic();
      if (!mountedRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      handleRef.current = startRecording(stream);
      streamRef.current = stream;
      setLiveStream(stream);
    } catch (error) {
      setProblem(errorMessage(error));
      dispatchRaw({ type: "RECORD_FAILED" });
    }
  }

  async function handleStop() {
    const handle = handleRef.current;
    if (!handle) return;
    handleRef.current = null;
    setLiveStream(null);
    dispatchRaw({ type: "STOP" });
    try {
      const recording = await handle.stop();
      pendingRef.current = recording;
      await save(recording);
    } catch (error) {
      dispatchRaw({ type: "SAVE_FAILED", message: errorMessage(error) });
    }
  }

  function handlePause() {
    if (!handleRef.current || !canPause(state, rules)) return;
    handleRef.current.pause();
    setLiveStream(null);
    dispatchRaw({ type: "PAUSE" });
  }

  function handleResume() {
    if (!handleRef.current) return;
    handleRef.current.resume();
    setLiveStream(streamRef.current);
    dispatchRaw({ type: "RESUME" });
  }

  async function handleRetry() {
    const recording = pendingRef.current;
    if (!recording) return;
    dispatchRaw({ type: "RETRY_SAVE" });
    await save(recording);
  }

  const reachedHardLimit = props.hardLimitSec !== undefined && state.kind === "recording" && elapsed >= props.hardLimitSec * 1000;
  useEffect(() => {
    if (reachedHardLimit) void handleStop();
  });

  const timeUpHandledRef = useRef(false);
  useEffect(() => {
    if (!props.timeUp || timeUpHandledRef.current) return;
    stopSpeaking();
    if (isCapturing(state)) {
      void handleStop();
      return;
    }
    if (state.kind === "saving" || state.kind === "save-failed") return;
    timeUpHandledRef.current = true;
    props.onTimeUpHandled?.();
  });

  const showPrompt = rules.showPromptText || (state.kind === "answerable" && state.playbackFailed);
  const listensLabel = rules.maxListens === null ? `${state.listens}회` : `${state.listens}/${rules.maxListens}`;

  return (
    <section className="card exam-main" aria-labelledby="question-heading">
      <h2 id="question-heading">{props.heading}</h2>
      <p className="topic">주제: {question.topic}</p>
      <div className="exam-controls">
        <button
          type="button"
          className={`play-button${state.kind === "playing" ? " is-playing" : ""}`}
          onClick={handlePlay}
          disabled={!canListen(state, rules)}
        >
          <span aria-hidden="true" className="play-icon">{state.kind === "playing" ? "♪" : "▶"}</span>
          질문 듣기 ({listensLabel})
        </button>
        <div className={`record-panel${state.kind === "recording" ? " is-recording" : ""}`}>
          {isCapturing(state) ? (
            <div className="record-row">
              <button type="button" className="danger record-button" onClick={handleStop}>
                {state.kind === "recording" && <span aria-hidden="true" className="rec-dot" />}녹음 정지
              </button>
              {state.kind === "recording" && rules.allowPause && (
                <button type="button" className="record-button" onClick={handlePause}>일시정지</button>
              )}
              {state.kind === "paused" && (
                <button type="button" className="primary record-button" onClick={handleResume}>이어서 녹음</button>
              )}
            </div>
          ) : (
            <button type="button" className="primary record-button" onClick={handleRecord} disabled={!canRecord(state)}>녹음 시작</button>
          )}
          {liveStream && <LevelMeter stream={liveStream} />}
          {isCapturing(state) && <RecordingClock elapsed={elapsed} targetSec={props.hardLimitSec ?? props.practiceTargetSec} isHardLimit={props.hardLimitSec !== undefined} />}
        </div>
      </div>
      {showPrompt ? <p className="prompt" lang="en">{question.prompt}</p> : <p className="prompt muted">질문을 듣고 답하세요.</p>}
      {props.showCoaching && <CoachingCard type={question.type} />}
      <p className="status" role="status" aria-live="polite" data-state={state.kind}>{STATUS_TEXT[state.kind]}</p>
      {state.kind === "save-failed" && <p className="error" role="alert">{state.message}</p>}
      {problem && <p className="error" role="alert">{problem}</p>}
      <div className="actions exam-footer">
        {state.kind === "save-failed" && <button type="button" onClick={handleRetry}>저장 다시 시도</button>}
        {state.kind === "saved" && rules.allowRerecord && (
          <button type="button" onClick={() => dispatchRaw({ type: "RERECORD" })}>다시 녹음</button>
        )}
        {props.onNext && (
          <button type="button" className="primary next-button" onClick={props.onNext} disabled={!canAdvance(state)}>
            {props.nextLabel ?? "다음 문항"} <span aria-hidden="true">›</span>
          </button>
        )}
      </div>
    </section>
  );
}

function RecordingClock({ elapsed, targetSec, isHardLimit }: { elapsed: number; targetSec: number | null; isHardLimit: boolean }) {
  const reached = targetSec !== null && elapsed >= targetSec * 1000;
  const label = isHardLimit ? "제한 시간" : "연습 목표";
  return (
    <p className="clock">
      경과 {formatDuration(elapsed)}
      {targetSec !== null && ` / ${label} ${formatDuration(targetSec * 1000)}`}
      {reached && !isHardLimit && " · 목표 도달 (자동으로 끊지 않습니다)"}
    </p>
  );
}
