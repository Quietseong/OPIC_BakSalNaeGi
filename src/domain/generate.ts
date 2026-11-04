import type { Difficulty, Question, QuestionPool, SelfAssessment, Topic } from "./types";

export type Rng = () => number;

export type ExamPlan = {
  first: string[];
  second: Record<Difficulty, string[]>;
};

export const MIN_SURVEY_TOPICS = 2;

export function mulberry32(seed: number): Rng {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: readonly T[], rng: Rng): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(rng() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap] as T, copy[index] as T];
  }
  return copy;
}

function pick<T>(items: readonly T[], rng: Rng): T {
  const item = items[Math.floor(rng() * items.length)];
  if (item === undefined) throw new Error("cannot pick from an empty list");
  return item;
}

function combo(topic: Topic, middle: "routines" | "changes", rng: Rng): Question[] {
  return [pick(topic.descriptions, rng), pick(topic[middle], rng), pick(topic.experiences, rng)];
}

function chooseTopics(pool: QuestionPool, surveyTopicIds: string[], rng: Rng): [Topic, Topic, Topic] {
  const selected = shuffle(pool.topics.filter((topic) => surveyTopicIds.includes(topic.id)), rng);
  const others = shuffle(pool.topics.filter((topic) => !surveyTopicIds.includes(topic.id)), rng);
  const [first, second, ...restSelected] = [...selected, ...others];
  const surprise = others[0] ?? restSelected[0];
  if (!first || !second || !surprise) throw new Error("question pool needs at least three topics");
  return [first, second, surprise];
}

const ids = (questions: Question[]) => questions.map((question) => question.id);

// The surprise topic plays the role of the unexpected ("돌발") topic in the second session.
export function generatePlan(
  pool: QuestionPool,
  survey: { topicIds: string[]; selfAssessment: SelfAssessment },
  rng: Rng,
): ExamPlan {
  const [topicA, topicB, surprise] = chooseTopics(pool, survey.topicIds, rng);
  const firstMiddle = survey.selfAssessment <= 2 ? "routines" : "changes";
  const roleplay = pick(pool.roleplays, rng);
  const advanced = pick(pool.advanced, rng);
  const surpriseEasy = combo(surprise, "routines", rng);
  const surpriseHard = combo(surprise, "changes", rng);
  return {
    first: ids([pick(pool.intros, rng), ...combo(topicA, firstMiddle, rng), ...combo(topicB, firstMiddle, rng)]),
    second: {
      easier: ids([...surpriseEasy, roleplay.ask, roleplay.experience]),
      similar: ids([...surpriseEasy, roleplay.ask, roleplay.solve, roleplay.experience, advanced.comparison]),
      harder: ids([...surpriseHard, roleplay.ask, roleplay.solve, roleplay.experience, advanced.comparison, advanced.issue]),
    },
  };
}

export function practiceDifficulty(selfAssessment: SelfAssessment): Difficulty {
  if (selfAssessment <= 2) return "easier";
  return selfAssessment <= 4 ? "similar" : "harder";
}

export function allPoolQuestions(pool: QuestionPool): Question[] {
  return [
    ...pool.intros,
    ...pool.topics.flatMap((topic) => [...topic.descriptions, ...topic.routines, ...topic.changes, ...topic.experiences]),
    ...pool.roleplays.flatMap((roleplay) => [roleplay.ask, roleplay.solve, roleplay.experience]),
    ...pool.advanced.flatMap((advanced) => [advanced.comparison, advanced.issue]),
  ];
}
