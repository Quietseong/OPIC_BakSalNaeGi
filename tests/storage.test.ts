import { IDBFactory } from "fake-indexeddb";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { PRACTICE_SET_A } from "../src/domain/question-sets";
import { createSession } from "../src/domain/session";
import { PracticeStore, StorageError, nextAttemptNo } from "../src/storage/db";

import type { Attempt } from "../src/domain/types";

const session = createSession(PRACTICE_SET_A, { mode: "practice", practiceTargetSec: null }, { id: "s1", now: 1 });

function attempt(id: string, questionId: string, attemptNo: number, sessionId = "s1"): Attempt {
  return { id, sessionId, questionId, attemptNo, mimeType: "audio/webm", durationMs: 2000, sizeBytes: 3, createdAt: attemptNo, note: "" };
}

describe("PracticeStore", () => {
  let factory: IDBFactory;
  let store: PracticeStore;

  beforeEach(async () => {
    factory = new IDBFactory();
    store = await PracticeStore.open(factory);
  });

  afterEach(() => store.close());

  it("should_return_the_saved_recording_after_reopening_the_database", async () => {
    await store.saveSession(session);
    await store.saveAttempt(attempt("a1", "a-01", 1), new Blob([new Uint8Array([1, 2, 3])], { type: "audio/webm" }));
    store.close();

    store = await PracticeStore.open(factory);
    const recording = await store.getRecording("a1");
    expect(recording && new Uint8Array(await recording.arrayBuffer())).toEqual(new Uint8Array([1, 2, 3]));
    expect(await store.getSession("s1")).toEqual(session);
  });

  it("should_keep_earlier_attempts_when_the_user_answers_again", async () => {
    await store.saveAttempt(attempt("a1", "a-01", 1), new Blob(["x"]));
    await store.saveAttempt(attempt("a2", "a-01", 2), new Blob(["y"]));
    const attempts = await store.listAttempts("s1");
    expect(attempts.map((a) => a.attemptNo)).toEqual([1, 2]);
  });

  it("should_only_list_attempts_of_the_requested_session", async () => {
    await store.saveAttempt(attempt("a1", "a-01", 1), new Blob(["x"]));
    await store.saveAttempt(attempt("b1", "a-01", 1, "other"), new Blob(["y"]));
    expect((await store.listAttempts("s1")).map((a) => a.id)).toEqual(["a1"]);
  });

  it("should_remove_the_recording_together_with_the_attempt", async () => {
    await store.saveAttempt(attempt("a1", "a-01", 1), new Blob(["x"]));
    await store.deleteAttempt("a1");
    expect(await store.listAttempts("s1")).toEqual([]);
    expect(await store.getRecording("a1")).toBeUndefined();
  });

  it("should_delete_a_session_with_all_its_attempts_and_recordings", async () => {
    await store.saveSession(session);
    await store.saveAttempt(attempt("a1", "a-01", 1), new Blob(["x"]));
    await store.saveAttempt(attempt("a2", "a-02", 1), new Blob(["y"]));
    await store.deleteSession("s1");
    expect(await store.listSessions()).toEqual([]);
    expect(await store.getRecording("a2")).toBeUndefined();
  });

  it("should_persist_a_self_review_note", async () => {
    await store.saveAttempt(attempt("a1", "a-01", 1), new Blob(["x"]));
    await store.updateNote("a1", "past tense mistakes");
    expect((await store.listAttempts("s1"))[0]?.note).toBe("past tense mistakes");
  });

  it("should_not_keep_attempt_metadata_when_the_recording_write_fails", async () => {
    const unclonable = { arrayBuffer: () => undefined } as unknown as Blob;
    Object.defineProperty(unclonable, "fn", { value: () => undefined, enumerable: true });
    await expect(store.saveAttempt(attempt("a1", "a-01", 1), unclonable)).rejects.toBeInstanceOf(StorageError);
    expect(await store.listAttempts("s1")).toEqual([]);
  });

  it("should_raise_a_storage_error_when_the_database_is_closed", async () => {
    store.close();
    await expect(store.saveSession(session)).rejects.toBeInstanceOf(StorageError);
    store = await PracticeStore.open(factory);
  });
});

describe("nextAttemptNo", () => {
  it("should_not_reuse_a_number_after_an_earlier_attempt_was_deleted", () => {
    expect(nextAttemptNo([attempt("a2", "a-01", 2)], "a-01")).toBe(3);
    expect(nextAttemptNo([], "a-01")).toBe(1);
  });
});
