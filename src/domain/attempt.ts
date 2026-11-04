import type { Attempt } from "./types";

export type AttemptInput = Pick<Attempt, "sessionId" | "questionId" | "attemptNo" | "mimeType" | "durationMs" | "sizeBytes">;

export function newAttempt(input: AttemptInput, options: { id: string; now: number }): Attempt {
  return { ...input, id: options.id, createdAt: options.now, note: "", transcript: "", revised: "" };
}
