export type MicErrorKind = "denied" | "no-device" | "unsupported" | "other";

export class MicError extends Error {
  constructor(readonly kind: MicErrorKind, cause?: unknown) {
    super(MIC_ERROR_MESSAGES[kind], { cause });
    this.name = "MicError";
  }
}

export const MIC_ERROR_MESSAGES: Record<MicErrorKind, string> = {
  denied: "마이크 권한이 거부되었습니다. 주소창의 사이트 설정에서 마이크를 허용한 뒤 다시 시도하세요.",
  "no-device": "마이크를 찾을 수 없습니다. 마이크를 연결한 뒤 다시 시도하세요.",
  unsupported: "이 브라우저는 녹음을 지원하지 않습니다. 최신 Chrome 또는 Edge에서 localhost로 실행하세요.",
  other: "마이크를 시작하지 못했습니다. 다른 앱이 마이크를 쓰고 있는지 확인하세요.",
};

const PREFERRED_TYPES = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];

function pickMimeType(): string {
  return PREFERRED_TYPES.find((type) => MediaRecorder.isTypeSupported(type)) ?? "";
}

export async function requestMic(): Promise<MediaStream> {
  if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
    throw new MicError("unsupported");
  }
  try {
    return await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch (error) {
    const name = error instanceof DOMException ? error.name : "";
    if (name === "NotAllowedError" || name === "SecurityError") throw new MicError("denied", error);
    if (name === "NotFoundError" || name === "OverconstrainedError") throw new MicError("no-device", error);
    throw new MicError("other", error);
  }
}

export type Recording = { blob: Blob; durationMs: number; mimeType: string };

export type RecordingHandle = { pause(): void; resume(): void; stop(): Promise<Recording> };

// MediaRecorder WebM files report an Infinity duration, so the length is measured here.
export function startRecording(stream: MediaStream): RecordingHandle {
  const recorder = new MediaRecorder(stream, { mimeType: pickMimeType() });
  const chunks: Blob[] = [];
  let activeMs = 0;
  let segmentStart: number | null = performance.now();
  const closeSegment = () => {
    if (segmentStart !== null) activeMs += performance.now() - segmentStart;
    segmentStart = null;
  };
  recorder.ondataavailable = (event) => {
    if (event.data.size > 0) chunks.push(event.data);
  };
  const stopped = new Promise<Recording>((resolve, reject) => {
    recorder.onstop = () => {
      stream.getTracks().forEach((track) => track.stop());
      const blob = new Blob(chunks, { type: recorder.mimeType });
      if (blob.size === 0) reject(new Error("녹음된 소리가 없습니다."));
      else resolve({ blob, durationMs: Math.round(activeMs), mimeType: recorder.mimeType });
    };
  });
  recorder.start(250);
  return {
    pause() {
      if (recorder.state !== "recording") return;
      closeSegment();
      recorder.pause();
    },
    resume() {
      if (recorder.state !== "paused") return;
      segmentStart = performance.now();
      recorder.resume();
    },
    stop() {
      closeSegment();
      if (recorder.state !== "inactive") recorder.stop();
      return stopped;
    },
  };
}
