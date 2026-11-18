// Captures README screenshots from the running dev server (npm run dev) in a fresh browser profile,
// so no personal recordings end up in the images. Output: docs/screenshots/*.png
import { mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { chromium, expect } from "@playwright/test";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "docs", "screenshots");
const BASE_URL = "http://localhost:5173/";
// Matches the seeded training question (first trip abroad), told as a different story from the model answer.
const KEYWORDS = ["재작년 여름, 베트남 다낭, 회사 동기 2명", "택시 기사가 길 잃음, 30분 늦게 도착", "처음엔 짜증, 바다 보고 풀림", "또 가고 싶음, 다음엔 혼자"];

mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"] });
const context = await browser.newContext({ baseURL: BASE_URL, viewport: { width: 1100, height: 820 }, permissions: ["microphone"] });
// A fixed random sequence keeps the generated exam and the training question the same on every run.
await context.addInitScript(() => {
  let seed = 7;
  Math.random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
});
const page = await context.newPage();
const shot = (name, options = {}) => page.screenshot({ path: join(outDir, `${name}.png`), ...options });
// Long pages are cut at the bottom of `until`, or start at the top of `from`, so each image shows one idea.
async function shotRange(name, { from, until }) {
  const top = from ? (await from.boundingBox()).y - 16 : 0;
  const bottom = until ? (await until.boundingBox()).y + (await until.boundingBox()).height + 16 : await page.evaluate(() => document.body.scrollHeight);
  await shot(name, { fullPage: true, clip: { x: 0, y: top, width: 1100, height: bottom - top } });
}

async function listenAndRecord(recordMs) {
  await page.getByRole("button", { name: /질문 듣기/ }).click();
  await expect(page.getByRole("button", { name: "녹음 시작" })).toBeEnabled({ timeout: 60_000 });
  await page.getByRole("button", { name: "녹음 시작" }).click();
  await page.getByRole("button", { name: "녹음 정지" }).waitFor();
  await page.waitForTimeout(recordMs);
}

async function stopAndWaitSaved() {
  await page.getByRole("button", { name: "녹음 정지" }).click();
  await page.getByRole("status").filter({ hasText: "답변이 저장되었습니다." }).waitFor();
}

await page.goto("/");
await page.getByLabel(/실전 모드/).check();
await page.getByLabel("카페").check();
await page.getByLabel("음악").check();
await shot("01-home", { fullPage: true });

await page.getByRole("button", { name: "마이크 점검 후 시작" }).click();
await page.getByRole("button", { name: "3초 테스트 녹음" }).click();
await expect(page.getByRole("button", { name: "연습 시작" })).toBeEnabled({ timeout: 15_000 });
await shot("02-mic-check");
await page.getByRole("button", { name: "연습 시작" }).click();

await listenAndRecord(2500);
await shot("03-exam-recording");
await stopAndWaitSaved();
await page.getByRole("button", { name: "나가기 (진행 상태는 저장됨)" }).click();
await page.getByRole("button", { name: "복기" }).first().click();
const item = page.locator(".review-item").first();
await item.getByLabel(/받아쓰기/).fill("My name is Minsu, and um, I work at IT company in Seoul.");
await item.getByLabel(/고친 문장/).fill("My name is Minsu, and I work at an IT company in Seoul.");
await item.getByLabel(/고친 문장/).blur();
await item.locator("details.model-answer summary").click();
await shotRange("04-review", { until: item });

await page.getByRole("button", { name: "처음으로" }).click();
await page.getByRole("button", { name: "새 질문으로 3번 줄여 말하기" }).click();
await page.getByRole("button", { name: "훈련 시작" }).click();
await page.getByRole("heading", { name: "1단계 · 모범 답안 공부" }).waitFor();
await shot("05-training-study", { fullPage: true });

await page.getByRole("button", { name: "내 이야기로 바꾸기" }).click();
const inputs = page.locator("form input[type=text]");
for (let index = 0; index < (await inputs.count()); index += 1) await inputs.nth(index).fill(KEYWORDS[index % KEYWORDS.length]);
await inputs.last().blur();
await shot("06-training-plan", { fullPage: true });

await page.getByRole("button", { name: "녹음하러 가기" }).click();
await listenAndRecord(2000);
await page.getByRole("button", { name: "일시정지" }).click();
await page.getByRole("status").filter({ hasText: "일시정지했습니다" }).waitFor();
await shot("07-training-round-paused", { fullPage: true });
await page.getByRole("button", { name: "이어서 녹음" }).click();
await page.waitForTimeout(800);
await stopAndWaitSaved();
for (const label of ["다음 라운드", "다음 라운드"]) {
  await page.getByRole("button", { name: label }).click();
  await listenAndRecord(1200);
  await stopAndWaitSaved();
}
await page.getByRole("button", { name: "결과 보기" }).click();
await page.locator(".attempt audio").nth(2).waitFor();
const firstRound = page.locator("[data-attempt-no='1']");
await firstRound.getByLabel(/받아쓰기/).fill("Two years ago, um, I go to Da Nang with my coworker.");
await firstRound.getByLabel(/고친 문장/).fill("Two years ago, I went to Da Nang with two of my coworkers.");
await firstRound.getByLabel(/고친 문장/).blur();
await shotRange("08-training-result", { until: firstRound });
await shotRange("09-training-rate", { from: page.locator(".plan-box") });

await browser.close();
console.log(`screenshots saved to ${outDir}`);
