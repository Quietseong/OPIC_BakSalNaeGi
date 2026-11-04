import { describe, expect, it } from "vitest";

import { dueCards, scheduleReview } from "../src/domain/review-schedule";

const DAY = 24 * 60 * 60 * 1000;

describe("review schedule", () => {
  it("should_bring_a_stuck_question_back_the_next_day", () => {
    expect(scheduleReview(undefined, "q", "stuck", 0)).toEqual({ questionId: "q", box: 0, dueAt: DAY, updatedAt: 0 });
  });

  it("should_space_reviews_1_3_7_14_30_days_as_answers_go_well", () => {
    let card = scheduleReview(undefined, "q", "stuck", 0);
    const gaps: number[] = [];
    for (let round = 0; round < 5; round += 1) {
      card = scheduleReview(card, "q", "good", 0);
      gaps.push(card.dueAt / DAY);
    }
    expect(gaps).toEqual([3, 7, 14, 30, 30]);
  });

  it("should_reset_to_one_day_when_a_well_known_question_gets_stuck_again", () => {
    const known = { questionId: "q", box: 4, dueAt: 0, updatedAt: 0 };
    expect(scheduleReview(known, "q", "stuck", 100).dueAt).toBe(100 + DAY);
  });

  it("should_list_only_due_cards_oldest_first", () => {
    const cards = [
      { questionId: "later", box: 0, dueAt: 50, updatedAt: 0 },
      { questionId: "due-2", box: 0, dueAt: 20, updatedAt: 0 },
      { questionId: "due-1", box: 0, dueAt: 10, updatedAt: 0 },
    ];
    expect(dueCards(cards, 30).map((card) => card.questionId)).toEqual(["due-1", "due-2"]);
  });
});
