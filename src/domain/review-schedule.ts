import type { ReviewCard } from "./types";

const DAY_MS = 24 * 60 * 60 * 1000;

export const REVIEW_INTERVAL_DAYS = [1, 3, 7, 14, 30] as const;

export type ReviewOutcome = "stuck" | "good";

function intervalDays(box: number): number {
  return REVIEW_INTERVAL_DAYS[Math.min(box, REVIEW_INTERVAL_DAYS.length - 1)] ?? 1;
}

// Leitner boxes: a stuck answer restarts at one day, a good one moves the next review further out.
export function scheduleReview(card: ReviewCard | undefined, questionId: string, outcome: ReviewOutcome, now: number): ReviewCard {
  const box = outcome === "stuck" ? 0 : (card ? card.box + 1 : 1);
  return { questionId, box, dueAt: now + intervalDays(box) * DAY_MS, updatedAt: now };
}

export function dueCards(cards: ReviewCard[], now: number): ReviewCard[] {
  return cards.filter((card) => card.dueAt <= now).sort((a, b) => a.dueAt - b.dueAt);
}
