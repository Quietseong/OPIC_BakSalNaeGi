import { expect, test } from "@playwright/test";

import { answerCurrentQuestion, installSpeechStub, startSession } from "./helpers";

test.beforeEach(async ({ page }) => installSpeechStub(page));

test("training: three shrinking rounds, auto-stop at the limit, compare, transcribe, and come back the next day", async ({ page }) => {
  await page.clock.install();
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "오늘 복습할 질문 0개" })).toBeVisible();
  await page.getByRole("button", { name: "새 질문으로 3번 줄여 말하기" }).click();
  await expect(page.getByText(/답변 뼈대 ·/)).toBeVisible();
  const prompt = await page.locator(".prompt[lang=en]").first().textContent();
  await page.getByRole("button", { name: "훈련 시작" }).click();

  await expect(page.getByRole("heading", { name: "1라운드 · 제한 90초" })).toBeVisible();
  await page.getByRole("button", { name: /질문 듣기/ }).click();
  await page.getByRole("button", { name: "녹음 시작" }).click();
  await expect(page.getByRole("button", { name: "녹음 정지" })).toBeVisible();
  await page.waitForTimeout(800);
  await page.clock.fastForward("01:31");
  await expect(page.getByRole("status").filter({ hasText: "답변이 저장되었습니다." })).toBeVisible();
  await page.getByRole("button", { name: "다음 라운드" }).click();

  await expect(page.getByRole("heading", { name: "2라운드 · 제한 70초" })).toBeVisible();
  await answerCurrentQuestion(page);
  await page.getByRole("button", { name: "다음 라운드" }).click();
  await expect(page.getByRole("heading", { name: "3라운드 · 제한 50초" })).toBeVisible();
  await answerCurrentQuestion(page);
  await page.getByRole("button", { name: "결과 보기" }).click();

  await expect(page.locator("audio")).toHaveCount(3);
  await expect(page.getByText(/^1라운드 \(90초\)/)).toBeVisible();
  const first = page.locator("[data-attempt-no='1']");
  await first.getByLabel(/받아쓰기/).fill("I go to cafe yesterday");
  await first.getByLabel(/고친 문장/).fill("I went to a cafe yesterday");
  await first.getByLabel(/고친 문장/).blur();

  await page.getByRole("button", { name: "막혔어요 (내일 다시)" }).click();
  await expect(page.getByText(/복습 목록에 다시 나옵니다/)).toBeVisible();

  await page.getByRole("button", { name: "처음으로" }).click();
  await expect(page.getByRole("heading", { name: "오늘 복습할 질문 0개" })).toBeVisible();
  await page.clock.fastForward("24:01:00");
  await page.reload();
  await expect(page.getByRole("heading", { name: "오늘 복습할 질문 1개" })).toBeVisible();

  await page.getByRole("button", { name: "결과 보기" }).click();
  await expect(page.locator("[data-attempt-no='1']").getByLabel(/고친 문장/)).toHaveValue("I went to a cafe yesterday");
  await page.getByRole("button", { name: "처음으로" }).click();

  await page.getByRole("button", { name: "복습하기" }).click();
  await expect(page.locator(".prompt[lang=en]").first()).toHaveText(prompt ?? "");
  await expect(page.getByRole("button", { name: "다른 질문" })).toHaveCount(0);
});

test("review: a corrected sentence is shown while answering again, and the question can be queued for review", async ({ page }) => {
  await startSession(page, "practice");
  await expect(page.getByText(/답변 뼈대 · 자기소개/)).toBeVisible();
  await answerCurrentQuestion(page);
  await page.getByRole("button", { name: "나가기 (진행 상태는 저장됨)" }).click();
  await page.getByRole("button", { name: "복기" }).click();

  const item = page.locator(".review-item").first();
  await item.getByLabel(/고친 문장/).fill("I live in Seoul with my parents.");
  await item.getByLabel(/고친 문장/).blur();
  await item.getByRole("button", { name: "이 질문에 다시 답변" }).click();
  await expect(item.locator(".revision-ref")).toContainText("I live in Seoul with my parents.");

  await item.getByRole("button", { name: "복습 목록에 넣기" }).click();
  await expect(item.getByText(/에 다시 나옵니다/)).toBeVisible();
});

test("exam mode hides the answer skeleton", async ({ page }) => {
  await startSession(page, "exam");
  await expect(page.getByRole("heading", { name: "1차 세션 · 문항 1" })).toBeVisible();
  await expect(page.getByText(/답변 뼈대/)).toHaveCount(0);
});
