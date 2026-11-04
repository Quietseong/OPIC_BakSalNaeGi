import { describe, expect, it } from "vitest";

import { allPoolQuestions } from "../src/domain/generate";
import { MODEL_ANSWERS, findModelAnswer } from "../src/domain/model-answers";
import { QUESTION_POOL } from "../src/domain/question-pool-data";

const wordCount = (text: string) => text.trim().split(/\s+/).length;

describe("model answers", () => {
  it("cover every pool question exactly once", () => {
    const poolIds = allPoolQuestions(QUESTION_POOL).map((question) => question.id).sort();
    const answerIds = MODEL_ANSWERS.map((answer) => answer.questionId).sort();
    expect(answerIds).toEqual(poolIds);
  });

  it("stay in the 130-180 word range with Korean study points", () => {
    for (const answer of MODEL_ANSWERS) {
      expect(wordCount(answer.text), answer.questionId).toBeGreaterThanOrEqual(130);
      expect(wordCount(answer.text), answer.questionId).toBeLessThanOrEqual(180);
      expect(answer.points.length, answer.questionId).toBeGreaterThanOrEqual(2);
    }
  });

  it("returns undefined for an unknown question", () => {
    expect(findModelAnswer("no-such-question")).toBeUndefined();
  });
});
