import { expect, test } from "@playwright/test";

import { answerAndAdvance, installSpeechStub, startSession } from "./helpers";

test("exam: two listens, hidden prompt, difficulty branch after question 7, 12 questions on the easier path", async ({ page }) => {
  await installSpeechStub(page);
  await startSession(page, "exam");
  await expect(page.getByText("남은 시간 39:5")).toBeVisible();
  await expect(page.locator(".prompt[lang=en]")).toHaveCount(0);

  const listen = page.getByRole("button", { name: /질문 듣기/ });
  await listen.click();
  await expect(listen).toHaveAccessibleName("질문 듣기 (1/2)");
  await expect(listen).toBeEnabled();
  await listen.click();
  await expect(listen).toHaveAccessibleName("질문 듣기 (2/2)");
  await expect(page.getByRole("button", { name: "녹음 시작" })).toBeEnabled();
  await expect(listen).toBeDisabled();
  await expect(page.getByRole("button", { name: "다음 문항" })).toBeDisabled();
  await page.getByRole("button", { name: "녹음 시작" }).click();
  await page.waitForTimeout(800);
  await page.getByRole("button", { name: "녹음 정지" }).click();
  await expect(page.getByRole("button", { name: "다시 녹음" })).toHaveCount(0);
  await page.getByRole("button", { name: "다음 문항" }).click();

  await answerAndAdvance(page, 6);
  await expect(page.getByRole("heading", { name: "난이도 재조정" })).toBeVisible();
  await page.getByRole("button", { name: "쉬운 질문" }).click();
  await expect(page.getByRole("heading", { name: "2차 세션 · 문항 8" })).toBeVisible();
  await answerAndAdvance(page, 5);
  await expect(page.getByRole("heading", { name: "모든 문항을 마쳤습니다" })).toBeVisible();
  await page.getByRole("button", { name: "복기하기" }).click();
  await expect(page.locator("audio")).toHaveCount(12);
});

test("exam: progress resumes at the same question after a reload", async ({ page }) => {
  await installSpeechStub(page);
  await startSession(page, "exam");
  await answerAndAdvance(page, 2);
  await expect(page.getByRole("heading", { name: "1차 세션 · 문항 3" })).toBeVisible();
  await page.reload();
  await expect(page.getByText("실전 · 3번 문항 진행 중")).toBeVisible();
  await page.getByRole("button", { name: "이어하기" }).click();
  await expect(page.getByRole("heading", { name: "1차 세션 · 문항 3" })).toBeVisible();
  await expect(page.getByText(/남은 시간 3\d:/)).toBeVisible();
});

test("exam: when speech fails the prompt text appears and the answer can still be recorded", async ({ page }) => {
  await installSpeechStub(page, "fails");
  await startSession(page, "exam");
  await page.getByRole("button", { name: /질문 듣기/ }).click();
  await expect(page.getByRole("alert")).toContainText("질문 텍스트를 보고 답변하세요");
  await expect(page.locator(".prompt[lang=en]")).toContainText(/yourself/i);
  await page.getByRole("button", { name: "녹음 시작" }).click();
  await page.waitForTimeout(800);
  await page.getByRole("button", { name: "녹음 정지" }).click();
  await expect(page.getByRole("button", { name: "다음 문항" })).toBeEnabled();
});

test("errors: a denied microphone is explained and nothing starts", async ({ page }) => {
  await installSpeechStub(page);
  await page.addInitScript(() => {
    navigator.mediaDevices.getUserMedia = () => Promise.reject(new DOMException("denied", "NotAllowedError"));
  });
  await page.goto("/");
  await page.getByLabel("카페").check();
  await page.getByLabel("음악").check();
  await page.getByRole("button", { name: "마이크 점검 후 시작" }).click();
  await page.getByRole("button", { name: "3초 테스트 녹음" }).click();
  await expect(page.getByRole("alert")).toContainText("마이크 권한이 거부되었습니다");
  await expect(page.getByRole("button", { name: "연습 시작" })).toBeDisabled();
});

test("errors: a failed save is shown, Next stays blocked, and retry stores the answer", async ({ page }) => {
  await installSpeechStub(page);
  await startSession(page, "practice");
  await page.evaluate(() => {
    const original = IDBObjectStore.prototype.put;
    let failures = 1;
    IDBObjectStore.prototype.put = function (this: IDBObjectStore, ...args: Parameters<IDBObjectStore["put"]>) {
      if (this.name === "recordings" && failures > 0) {
        failures -= 1;
        throw new DOMException("quota", "QuotaExceededError");
      }
      return original.apply(this, args);
    };
  });
  await page.getByRole("button", { name: /질문 듣기/ }).click();
  await page.getByRole("button", { name: "녹음 시작" }).click();
  await page.waitForTimeout(800);
  await page.getByRole("button", { name: "녹음 정지" }).click();
  await expect(page.getByRole("alert")).toContainText("저장소 작업 실패");
  await expect(page.getByRole("button", { name: "다음 문항" })).toBeDisabled();
  await page.getByRole("button", { name: "저장 다시 시도" }).click();
  await expect(page.getByRole("status").filter({ hasText: "답변이 저장되었습니다." })).toBeVisible();
  await page.getByRole("button", { name: "나가기 (진행 상태는 저장됨)" }).click();
  await page.getByRole("button", { name: "복기" }).click();
  await expect(page.locator("audio")).toHaveCount(1);
  await expect(page.locator("[data-attempt-no]")).toHaveCount(1);
});

test("audio: a generated question file is played instead of speech synthesis", async ({ page }) => {
  await installSpeechStub(page, "fails", { serveAudioFiles: true });
  await startSession(page, "exam");
  await page.getByRole("button", { name: /질문 듣기/ }).click();
  await expect(page.getByRole("status").filter({ hasText: "질문을 재생하고 있습니다." })).toBeVisible();
  await expect(page.getByRole("button", { name: "녹음 시작" })).toBeEnabled({ timeout: 20_000 });
  await expect(page.getByRole("alert")).toHaveCount(0);
  await expect(page.locator(".prompt[lang=en]")).toHaveCount(0);
  expect(await page.evaluate(() => (window as unknown as { __spoken: string[] }).__spoken)).toEqual([]);
});

test("exam: when 40 minutes run out mid-answer the recording is saved and the session ends", async ({ page }) => {
  await page.clock.install();
  await installSpeechStub(page);
  await startSession(page, "exam");
  await page.getByRole("button", { name: /질문 듣기/ }).click();
  await page.getByRole("button", { name: "녹음 시작" }).click();
  await expect(page.getByRole("button", { name: "녹음 정지" })).toBeVisible();
  await page.waitForTimeout(800);
  await page.clock.fastForward("40:00");
  await expect(page.getByRole("heading", { name: "모든 문항을 마쳤습니다" })).toBeVisible();
  await page.getByRole("button", { name: "복기하기" }).click();
  await expect(page.locator("audio")).toHaveCount(1);
});

test("leaving mid-answer keeps the recording", async ({ page }) => {
  await installSpeechStub(page);
  await startSession(page, "practice");
  await page.getByRole("button", { name: /질문 듣기/ }).click();
  await page.getByRole("button", { name: "녹음 시작" }).click();
  await expect(page.getByRole("button", { name: "녹음 정지" })).toBeVisible();
  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "나가기 (진행 상태는 저장됨)" }).click();
  await page.getByRole("button", { name: "복기" }).click();
  await expect(page.locator("audio")).toHaveCount(1);
});

test("exam: a failed save at time-up keeps the retry instead of ending and losing the answer", async ({ page }) => {
  await page.clock.install();
  await installSpeechStub(page);
  await startSession(page, "exam");
  await page.evaluate(() => {
    const original = IDBObjectStore.prototype.put;
    let failures = 1;
    IDBObjectStore.prototype.put = function (this: IDBObjectStore, ...args: Parameters<IDBObjectStore["put"]>) {
      if (this.name === "recordings" && failures > 0) {
        failures -= 1;
        throw new DOMException("quota", "QuotaExceededError");
      }
      return original.apply(this, args);
    };
  });
  await page.getByRole("button", { name: /질문 듣기/ }).click();
  await page.getByRole("button", { name: "녹음 시작" }).click();
  await expect(page.getByRole("button", { name: "녹음 정지" })).toBeVisible();
  await page.waitForTimeout(800);
  await page.clock.fastForward("40:00");
  await expect(page.getByRole("button", { name: "저장 다시 시도" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "모든 문항을 마쳤습니다" })).toHaveCount(0);
  await page.getByRole("button", { name: "저장 다시 시도" }).click();
  await expect(page.getByRole("heading", { name: "모든 문항을 마쳤습니다" })).toBeVisible();
  await page.getByRole("button", { name: "복기하기" }).click();
  await expect(page.locator("audio")).toHaveCount(1);
});
