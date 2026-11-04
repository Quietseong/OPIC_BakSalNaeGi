import { IDBFactory } from "fake-indexeddb";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createSession } from "../src/domain/session";
import { PracticeStore, StorageError, nextAttemptNo } from "../src/storage/db";

import type { Attempt } from "../src/domain/types";

const PLAN = { first: ["intro-1"], second: { easier: ["cafe-d1"], similar: ["cafe-d2"], harder: ["cafe-c1"] } };
const session = createSession(
  PLAN,
  { mode: "practice", practiceTargetSec: null, topicIds: ["cafe", "park"], selfAssessment: 3 },
  { id: "s1", now: 1, poolVersion: 1 },
);

function attempt(id: string, questionId: string, attemptNo: number, sessionId = "s1"): Attempt {
  return { id, sessionId, questionId, attemptNo, mimeType: "audio/webm", durationMs: 2000, sizeBytes: 3, createdAt: attemptNo, note: "", transcript: "", revised: "" };
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

  it("should_persist_note_transcript_and_revision_independently", async () => {
    await store.saveAttempt(attempt("a1", "a-01", 1), new Blob(["x"]));
    await store.updateAttemptText("a1", { note: "past tense mistakes" });
    await store.updateAttemptText("a1", { transcript: "I go there yesterday", revised: "I went there yesterday" });
    expect((await store.listAttempts("s1"))[0]).toMatchObject({
      note: "past tense mistakes",
      transcript: "I go there yesterday",
      revised: "I went there yesterday",
    });
  });

  it("should_not_keep_attempt_metadata_when_the_recording_write_fails", async () => {
    const unclonable = { arrayBuffer: () => undefined } as unknown as Blob;
    Object.defineProperty(unclonable, "fn", { value: () => undefined, enumerable: true });
    await expect(store.saveAttempt(attempt("a1", "a-01", 1), unclonable)).rejects.toBeInstanceOf(StorageError);
    expect(await store.listAttempts("s1")).toEqual([]);
  });

  it("should_read_a_session_saved_before_the_question_pool_with_set_a_branches", async () => {
    const legacy = { id: "old", setId: "set-a", setVersion: 1, settings: { mode: "exam", practiceTargetSec: null }, startedAt: 1, questionIds: ["a-01"], currentIndex: 0, difficulty: null, status: "in-progress" };
    await store.saveSession(legacy as unknown as typeof session);
    const loaded = await store.getSession("old");
    expect(loaded?.secondSession.easier[0]).toBe("a-e08");
    expect(loaded?.settings.selfAssessment).toBe(3);
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

describe("database upgrade", () => {
  it("should_keep_version_1_recordings_and_fill_the_new_text_fields", async () => {
    const factory = new IDBFactory();
    const request = factory.open("opic-practice", 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      db.createObjectStore("sessions", { keyPath: "id" });
      db.createObjectStore("attempts", { keyPath: "id" }).createIndex("bySession", "sessionId");
      db.createObjectStore("recordings");
    };
    const v1 = await new Promise<IDBDatabase>((resolve) => (request.onsuccess = () => resolve(request.result)));
    const tx = v1.transaction(["attempts", "recordings"], "readwrite");
    tx.objectStore("attempts").put({ id: "old", sessionId: "s1", questionId: "a-01", attemptNo: 1, mimeType: "audio/webm", durationMs: 1, sizeBytes: 1, createdAt: 1, note: "memo" });
    tx.objectStore("recordings").put(new Blob(["x"]), "old");
    await new Promise((resolve) => (tx.oncomplete = resolve));
    v1.close();

    const store = await PracticeStore.open(factory);
    expect((await store.listAttempts("s1"))[0]).toMatchObject({ note: "memo", transcript: "", revised: "" });
    expect(await store.getRecording("old")).toBeDefined();
    expect(await store.listReviewCards()).toEqual([]);
    store.close();
  });
});

describe("training and review storage", () => {
  it("should_delete_a_training_with_its_round_recordings", async () => {
    const store = await PracticeStore.open(new IDBFactory());
    await store.saveTraining({ id: "t1", questionId: "cafe-d1", createdAt: 1, roundLimitsSec: [90, 70, 50], plan: [] });
    await store.saveAttempt(attempt("r1", "cafe-d1", 1, "t1"), new Blob(["x"]));
    expect((await store.listTrainings()).map((t) => t.id)).toEqual(["t1"]);
    await store.deleteTraining("t1");
    expect(await store.listTrainings()).toEqual([]);
    expect(await store.getRecording("r1")).toBeUndefined();
    store.close();
  });

  it("should_keep_one_review_card_per_question", async () => {
    const store = await PracticeStore.open(new IDBFactory());
    await store.saveReviewCard({ questionId: "cafe-d1", box: 0, dueAt: 10, updatedAt: 1 });
    await store.saveReviewCard({ questionId: "cafe-d1", box: 1, dueAt: 20, updatedAt: 2 });
    expect(await store.listReviewCards()).toEqual([{ questionId: "cafe-d1", box: 1, dueAt: 20, updatedAt: 2 }]);
    await store.deleteReviewCard("cafe-d1");
    expect(await store.getReviewCard("cafe-d1")).toBeUndefined();
    store.close();
  });
});
