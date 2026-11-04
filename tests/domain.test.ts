import { describe, expect, it } from "vitest";

import { generatePlan, mulberry32 } from "../src/domain/generate";
import { QUESTION_POOL } from "../src/domain/question-pool-data";
import { findQuestion } from "../src/domain/questions";
import { INITIAL_RUNNER_STATE, canAdvance, runnerReducer } from "../src/domain/runner";
import { advance, chooseDifficulty, createSession, firstSessionLength, remainingMs, stageOf } from "../src/domain/session";

import type { RunnerEvent, RunnerRules, RunnerState } from "../src/domain/runner";
import type { SelfAssessment, Session } from "../src/domain/types";

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
  const plan = generatePlan(QUESTION_POOL, { topicIds: ["cafe", "music"], selfAssessment: 3 }, mulberry32(7));
  const settings = (mode: "practice" | "exam", selfAssessment: SelfAssessment = 3) => ({
    mode,
    practiceTargetSec: null,
    topicIds: ["cafe", "music"],
    selfAssessment,
  });
  const create = (mode: "practice" | "exam", selfAssessment: SelfAssessment = 3) =>
    createSession(plan, settings(mode, selfAssessment), { id: "s", now, poolVersion: 1 });

  it("should_pick_the_practice_length_from_self_assessment", () => {
    expect(create("practice", 1).questionIds).toHaveLength(12);
    expect(create("practice", 3).questionIds).toHaveLength(14);
    expect(create("practice", 6).questionIds).toHaveLength(15);
    expect(walkToEnd(create("practice")).status).toBe("completed");
  });

  it("should_ask_for_difficulty_after_seven_questions_in_exam_mode", () => {
    const afterFirst = walkToEnd(create("exam"));
    expect(afterFirst.currentIndex).toBe(7);
    expect(stageOf(afterFirst).kind).toBe("choose-difficulty");
    expect(afterFirst.status).toBe("in-progress");
  });

  it("should_continue_with_the_chosen_difficulty_branch", () => {
    const branched = chooseDifficulty(walkToEnd(create("exam")), "easier");
    expect(stageOf(branched)).toEqual({ kind: "question", questionId: plan.second.easier[0], number: 8 });
    expect(walkToEnd(branched).status).toBe("completed");
    expect(walkToEnd(branched).questionIds).toHaveLength(12);
    expect(firstSessionLength(branched)).toBe(7);
  });

  it("should_ignore_a_second_difficulty_choice", () => {
    const branched = chooseDifficulty(walkToEnd(create("exam")), "harder");
    expect(chooseDifficulty(branched, "easier")).toBe(branched);
  });

  it("should_count_down_forty_minutes_from_the_stored_start_time_in_exam_mode", () => {
    expect(remainingMs(create("exam"), now + 60_000)).toBe(39 * 60_000);
    expect(remainingMs(create("exam"), now + 41 * 60_000)).toBe(0);
    expect(remainingMs(create("practice"), now + 60_000)).toBeNull();
  });
});

describe("question generation", () => {
  const topicOf = (id: string) => findQuestion(id)?.topic;
  const survey = { topicIds: ["cafe", "music"], selfAssessment: 3 as SelfAssessment };

  it("should_follow_the_exam_shape_intro_then_two_survey_topic_combos", () => {
    const plan = generatePlan(QUESTION_POOL, survey, mulberry32(1));
    const types = plan.first.map((id) => findQuestion(id)?.type);
    expect(types).toEqual(["self-introduction", "description", "change", "past-experience", "description", "change", "past-experience"]);
    expect(new Set(plan.first.slice(1).map(topicOf))).toEqual(new Set(["카페", "음악"]));
  });

  it("should_use_routine_questions_for_low_self_assessment", () => {
    const plan = generatePlan(QUESTION_POOL, { ...survey, selfAssessment: 2 }, mulberry32(1));
    expect(findQuestion(plan.first[2] ?? "")?.type).toBe("routine");
  });

  it("should_draw_the_surprise_topic_from_topics_not_chosen_in_the_survey", () => {
    for (let seed = 0; seed < 50; seed += 1) {
      const plan = generatePlan(QUESTION_POOL, survey, mulberry32(seed));
      expect(["카페", "음악"]).not.toContain(topicOf(plan.second.similar[0] ?? ""));
    }
  });

  it("should_give_five_seven_and_eight_second_session_questions", () => {
    const plan = generatePlan(QUESTION_POOL, survey, mulberry32(3));
    expect([plan.second.easier.length, plan.second.similar.length, plan.second.harder.length]).toEqual([5, 7, 8]);
  });

  it("should_produce_different_sets_on_different_runs", () => {
    const plans = new Set(Array.from({ length: 20 }, (_, seed) => generatePlan(QUESTION_POOL, survey, mulberry32(seed)).first.join()));
    expect(plans.size).toBeGreaterThan(15);
  });

  it("should_only_reference_questions_that_exist_and_never_repeat_one_in_a_session", () => {
    for (let seed = 0; seed < 50; seed += 1) {
      const plan = generatePlan(QUESTION_POOL, survey, mulberry32(seed));
      const all = [...plan.first, ...plan.second.harder];
      expect(all.every((id) => findQuestion(id))).toBe(true);
      expect(new Set(all).size).toBe(all.length);
    }
  });
});
