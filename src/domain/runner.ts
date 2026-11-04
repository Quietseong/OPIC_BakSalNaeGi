export type RunnerRules = {
  maxListens: number | null;
  allowRerecord: boolean;
  allowPause: boolean;
};

export type RunnerState =
  | { kind: "ready"; listens: number }
  | { kind: "playing"; listens: number }
  | { kind: "answerable"; listens: number; playbackFailed: boolean }
  | { kind: "recording"; listens: number }
  | { kind: "paused"; listens: number }
  | { kind: "saving"; listens: number }
  | { kind: "saved"; listens: number }
  | { kind: "save-failed"; listens: number; message: string };

export type RunnerEvent =
  | { type: "PLAY" }
  | { type: "PLAY_ENDED" }
  | { type: "PLAY_FAILED" }
  | { type: "RECORD" }
  | { type: "RECORD_FAILED" }
  | { type: "PAUSE" }
  | { type: "RESUME" }
  | { type: "STOP" }
  | { type: "SAVE_OK" }
  | { type: "SAVE_FAILED"; message: string }
  | { type: "RETRY_SAVE" }
  | { type: "RERECORD" };

export const INITIAL_RUNNER_STATE: RunnerState = { kind: "ready", listens: 0 };

export function canListen(state: RunnerState, rules: RunnerRules): boolean {
  if (state.kind !== "ready" && state.kind !== "answerable") return false;
  return rules.maxListens === null || state.listens < rules.maxListens;
}

export function canRecord(state: RunnerState): boolean {
  return state.kind === "answerable";
}

export function canPause(state: RunnerState, rules: RunnerRules): boolean {
  return state.kind === "recording" && rules.allowPause;
}

export function isCapturing(state: RunnerState): boolean {
  return state.kind === "recording" || state.kind === "paused";
}

export function canAdvance(state: RunnerState): boolean {
  return state.kind === "saved";
}

export function runnerReducer(state: RunnerState, event: RunnerEvent, rules: RunnerRules): RunnerState {
  const { listens } = state;
  switch (event.type) {
    case "PLAY":
      return canListen(state, rules) ? { kind: "playing", listens: listens + 1 } : state;
    case "PLAY_ENDED":
      return state.kind === "playing" ? { kind: "answerable", listens, playbackFailed: false } : state;
    case "PLAY_FAILED":
      return state.kind === "playing" ? { kind: "answerable", listens, playbackFailed: true } : state;
    case "RECORD":
      return canRecord(state) ? { kind: "recording", listens } : state;
    case "RECORD_FAILED":
      return state.kind === "recording" ? { kind: "answerable", listens, playbackFailed: false } : state;
    case "PAUSE":
      return canPause(state, rules) ? { kind: "paused", listens } : state;
    case "RESUME":
      return state.kind === "paused" ? { kind: "recording", listens } : state;
    case "STOP":
      return isCapturing(state) ? { kind: "saving", listens } : state;
    case "SAVE_OK":
      return state.kind === "saving" ? { kind: "saved", listens } : state;
    case "SAVE_FAILED":
      return state.kind === "saving" ? { kind: "save-failed", listens, message: event.message } : state;
    case "RETRY_SAVE":
      return state.kind === "save-failed" ? { kind: "saving", listens } : state;
    case "RERECORD":
      return state.kind === "saved" && rules.allowRerecord
        ? { kind: "answerable", listens, playbackFailed: false }
        : state;
  }
}
