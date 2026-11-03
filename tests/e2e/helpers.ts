import { expect } from "@playwright/test";

import type { Page } from "@playwright/test";

export type SpeechMode = "speaks" | "fails";

export async function installSpeechStub(page: Page, mode: SpeechMode = "speaks") {
  await page.addInitScript((speechMode) => {
    const voice = { lang: "en-US", name: "stub", voiceURI: "stub", default: true, localService: true };
    class StubUtterance {
      voice: unknown = null;
      lang = "";
      rate = 1;
      onend: (() => void) | null = null;
      onerror: ((event: { error: string }) => void) | null = null;
      constructor(readonly text: string) {}
    }
    const synth = {
      getVoices: () => [voice],
      addEventListener: () => undefined,
      cancel: () => undefined,
      speak: (utterance: StubUtterance) => {
        (window as unknown as { __spoken: string[] }).__spoken.push(utterance.text);
        setTimeout(() => (speechMode === "fails" ? utterance.onerror?.({ error: "synthesis-failed" }) : utterance.onend?.()), 150);
      },
    };
    (window as unknown as { __spoken: string[] }).__spoken = [];
    Object.defineProperty(window, "speechSynthesis", { value: synth, configurable: true });
    Object.defineProperty(window, "SpeechSynthesisUtterance", { value: StubUtterance, configurable: true });
  }, mode);
}

export async function startSession(page: Page, mode: "practice" | "exam") {
  await page.goto("/");
  await page.getByLabel(mode === "practice" ? /연습 모드/ : /실전 모드/).check();
  await page.getByRole("button", { name: "마이크 점검 후 시작" }).click();
  await page.getByRole("button", { name: "3초 테스트 녹음" }).click();
  await expect(page.getByRole("button", { name: "연습 시작" })).toBeEnabled({ timeout: 10_000 });
  await page.getByRole("button", { name: "연습 시작" }).click();
}

export async function answerCurrentQuestion(page: Page, recordMs = 1200) {
  await page.getByRole("button", { name: /질문 듣기/ }).click();
  await expect(page.getByRole("button", { name: "녹음 시작" })).toBeEnabled();
  await page.getByRole("button", { name: "녹음 시작" }).click();
  await expect(page.getByRole("button", { name: "녹음 정지" })).toBeVisible();
  await page.waitForTimeout(recordMs);
  await page.getByRole("button", { name: "녹음 정지" }).click();
  await expect(page.getByRole("status").filter({ hasText: "답변이 저장되었습니다." })).toBeVisible();
}

export async function answerAndAdvance(page: Page, count: number) {
  for (let index = 0; index < count; index += 1) {
    await answerCurrentQuestion(page);
    await page.getByRole("button", { name: "다음 문항" }).click();
  }
}
