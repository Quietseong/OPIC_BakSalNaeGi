import { describe, expect, it } from "vitest";

import { PRACTICE_SET_A } from "../src/domain/question-sets";
import { INITIAL_RUNNER_STATE, canAdvance, runnerReducer } from "../src/domain/runner";
import { advance, chooseDifficulty, createSession, remainingMs, stageOf } from "../src/domain/session";

import type { RunnerEvent, RunnerRules, RunnerState } from "../src/domain/runner";
import type { Session } from "../src/domain/types";

const EXAM: RunnerRules = { maxListens: 2, allowRerecord: false };
const PRACTICE: RunnerRules = { maxListens: null, allowRerecord: true };

function run(rules: RunnerRules, ...events: RunnerEvent["type"][]): RunnerState {
  return events.reduce<RunnerState>(
    (state, type) => runnerReducer(state, { type, message: "disk full" } as RunnerEvent, rules),
    INITIAL_RUNNER_STATE,
  );
}

function walkToEnd(session: Session): Session {
  let current = session;
  while (stageOf(current).kind === "question") current = advance(current);
  return current;
}

describe("question runner", () => {
  it("should_allow_exactly_two_listens_in_exam_mode", () => {
    const afterTwo = run(EXAM, "PLAY", "PLAY_ENDED", "PLAY", "PLAY_ENDED");
    expect(runnerReducer(afterTwo, { type: "PLAY" }, EXAM)).toBe(afterTwo);
    expect(afterTwo.listens).toBe(2);
  });

  it("should_allow_unlimited_listens_in_practice_mode", () => {
    const state = run(PRACTICE, "PLAY", "PLAY_ENDED", "PLAY", "PLAY_ENDED", "PLAY");
    expect(state.kind).toBe("playing");
    expect(state.listens).toBe(3);
  });

  it("should_not_record_before_the_question_was_played", () => {
    expect(run(EXAM, "RECORD").kind).toBe("ready");
  });

  it("should_let_the_user_answer_when_playback_fails", () => {
    const state = run(EXAM, "PLAY", "PLAY_FAILED", "RECORD");
    expect(state.kind).toBe("recording");
  });

  it("should_return_to_answerable_when_the_microphone_fails_to_start", () => {
    expect(run(EXAM, "PLAY", "PLAY_ENDED", "RECORD", "RECORD_FAILED").kind).toBe("answerable");
  });

  it("should_block_listening_while_recording", () => {
    const recording = run(PRACTICE, "PLAY", "PLAY_ENDED", "RECORD");
    expect(runnerReducer(recording, { type: "PLAY" }, PRACTICE)).toBe(recording);
  });

  it("should_only_allow_next_after_the_answer_is_saved", () => {
    expect(canAdvance(run(EXAM, "PLAY", "PLAY_ENDED", "RECORD"))).toBe(false);
    expect(canAdvance(run(EXAM, "PLAY", "PLAY_ENDED", "RECORD", "STOP"))).toBe(false);
    expect(canAdvance(run(EXAM, "PLAY", "PLAY_ENDED", "RECORD", "STOP", "SAVE_OK"))).toBe(true);
  });

  it("should_keep_the_failure_visible_and_allow_retry_after_a_save_error", () => {
    const failed = run(EXAM, "PLAY", "PLAY_ENDED", "RECORD", "STOP", "SAVE_FAILED");
    expect(failed).toEqual({ kind: "save-failed", listens: 1, message: "disk full" });
    expect(canAdvance(failed)).toBe(false);
    expect(runnerReducer(failed, { type: "RETRY_SAVE" }, EXAM).kind).toBe("saving");
  });

  it("should_ignore_a_duplicate_stop", () => {
    const saving = run(EXAM, "PLAY", "PLAY_ENDED", "RECORD", "STOP");
    expect(runnerReducer(saving, { type: "STOP" }, EXAM)).toBe(saving);
  });

  it("should_allow_rerecording_only_in_practice", () => {
    const savedExam = run(EXAM, "PLAY", "PLAY_ENDED", "RECORD", "STOP", "SAVE_OK");
    const savedPractice = run(PRACTICE, "PLAY", "PLAY_ENDED", "RECORD", "STOP", "SAVE_OK");
    expect(runnerReducer(savedExam, { type: "RERECORD" }, EXAM).kind).toBe("saved");
    expect(runnerReducer(savedPractice, { type: "RERECORD" }, PRACTICE).kind).toBe("answerable");
  });
});

describe("session flow", () => {
  const now = 1_000_000;

  it("should_run_the_full_fifteen_question_set_in_practice_mode", () => {
    const session = createSession(PRACTICE_SET_A, { mode: "practice", practiceTargetSec: 120 }, { id: "s", now });
    expect(session.questionIds).toHaveLength(15);
    expect(walkToEnd(session).status).toBe("completed");
  });

  it("should_ask_for_difficulty_after_seven_questions_in_exam_mode", () => {
    const session = createSession(PRACTICE_SET_A, { mode: "exam", practiceTargetSec: null }, { id: "s", now });
    const afterFirst = walkToEnd(session);
    expect(afterFirst.currentIndex).toBe(7);
    expect(stageOf(afterFirst).kind).toBe("choose-difficulty");
    expect(afterFirst.status).toBe("in-progress");
  });

  it("should_continue_with_the_chosen_difficulty_branch", () => {
    const session = createSession(PRACTICE_SET_A, { mode: "exam", practiceTargetSec: null }, { id: "s", now });
    const branched = chooseDifficulty(walkToEnd(session), PRACTICE_SET_A, "easier");
    expect(stageOf(branched)).toEqual({ kind: "question", questionId: "a-e08", number: 8 });
    expect(walkToEnd(branched).status).toBe("completed");
    expect(walkToEnd(branched).questionIds).toHaveLength(12);
  });

  it("should_ignore_a_second_difficulty_choice", () => {
    const session = createSession(PRACTICE_SET_A, { mode: "exam", practiceTargetSec: null }, { id: "s", now });
    const branched = chooseDifficulty(walkToEnd(session), PRACTICE_SET_A, "harder");
    expect(chooseDifficulty(branched, PRACTICE_SET_A, "easier")).toBe(branched);
  });

  it("should_count_down_forty_minutes_from_the_stored_start_time_in_exam_mode", () => {
    const exam = createSession(PRACTICE_SET_A, { mode: "exam", practiceTargetSec: null }, { id: "s", now });
    const practice = createSession(PRACTICE_SET_A, { mode: "practice", practiceTargetSec: null }, { id: "p", now });
    expect(remainingMs(exam, now + 60_000)).toBe(39 * 60_000);
    expect(remainingMs(exam, now + 41 * 60_000)).toBe(0);
    expect(remainingMs(practice, now + 60_000)).toBeNull();
  });
});
