import { readFile } from "node:fs/promises";

import { expect, test } from "@playwright/test";

import { answerAndAdvance, answerCurrentQuestion, installSpeechStub, startSession } from "./helpers";

test.beforeEach(async ({ page }) => installSpeechStub(page));

test("practice: full 14-question set survives a reload and can be reviewed, re-answered, exported, and deleted", async ({ page }) => {
  await startSession(page, "practice");
  await expect(page.getByRole("heading", { name: "1차 세션 · 문항 1" })).toBeVisible();
  await expect(page.locator(".prompt[lang=en]")).toContainText(/yourself/i);

  await answerAndAdvance(page, 14);
  await expect(page.getByRole("heading", { name: "모든 문항을 마쳤습니다" })).toBeVisible();
  expect(await page.evaluate(() => (window as unknown as { __spoken: string[] }).__spoken.length)).toBe(14);

  await page.reload();
  await expect(page.getByText(/연습 · 완료/)).toBeVisible();
  await page.getByRole("button", { name: "복기" }).click();
  await expect(page.locator(".attempt audio")).toHaveCount(14);

  const firstAudioBytes = await page.locator(".attempt audio").first().evaluate(async (audio: HTMLAudioElement) => {
    const blob = await (await fetch(audio.src)).blob();
    const buffer = await new AudioContext().decodeAudioData(await blob.arrayBuffer());
    return { size: blob.size, seconds: buffer.duration };
  });
  expect(firstAudioBytes.size).toBeGreaterThan(1000);
  expect(firstAudioBytes.seconds).toBeGreaterThan(0.8);

  const firstItem = page.locator(".review-item").first();
  await firstItem.getByRole("button", { name: "이 질문에 다시 답변" }).click();
  await answerCurrentQuestion(page);
  await expect(firstItem.locator("[data-attempt-no]")).toHaveCount(2);

  const note = firstItem.locator("[data-attempt-no='1']").getByLabel("자가 메모");
  await note.fill("과거 시제를 섞어 씀");
  await note.blur();
  await page.reload();
  await page.getByRole("button", { name: "복기" }).click();
  await expect(page.locator(".review-item").first().locator("[data-attempt-no='1']").getByLabel("자가 메모")).toHaveValue("과거 시제를 섞어 씀");
  await expect(page.locator(".attempt audio")).toHaveCount(15);

  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "기록 내보내기 (JSON)" }).click();
  const exported = JSON.parse(await readFile(await (await download).path(), "utf8"));
  expect(exported.attempts).toHaveLength(15);
  expect(exported.questions).toHaveLength(14);

  page.once("dialog", (dialog) => dialog.accept());
  await page.locator(".review-item").first().locator("[data-attempt-no='2']").getByRole("button", { name: "답변 삭제" }).click();
  await expect(page.locator(".attempt audio")).toHaveCount(14);

  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "이 기록 삭제" }).click();
  await expect(page.getByRole("heading", { name: "OPIc 말하기 연습" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "연습 기록" })).toHaveCount(0);
});

test("practice: re-recording keeps both attempts", async ({ page }) => {
  await startSession(page, "practice");
  await answerCurrentQuestion(page);
  await page.getByRole("button", { name: "다시 녹음" }).click();
  await answerCurrentQuestion(page);
  await page.getByRole("button", { name: "다음 문항" }).click();
  await page.getByRole("button", { name: "나가기 (진행 상태는 저장됨)" }).click();
  await page.getByRole("button", { name: "복기" }).click();
  await expect(page.locator(".review-item").first().locator("[data-attempt-no]")).toHaveCount(2);
});

test("survey: start stays disabled until two topics are chosen", async ({ page }) => {
  await page.goto("/");
  const start = page.getByRole("button", { name: "마이크 점검 후 시작" });
  await expect(start).toBeDisabled();
  await page.getByLabel("카페").check();
  await expect(start).toBeDisabled();
  await page.getByLabel("영화").check();
  await expect(start).toBeEnabled();
});
