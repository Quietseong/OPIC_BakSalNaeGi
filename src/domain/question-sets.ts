import type { Question, QuestionSet } from "./types";

const q = (id: string, topic: string, type: Question["type"], prompt: string): Question => ({
  id,
  topic,
  type,
  prompt,
});

const firstSession: Question[] = [
  q("a-01", "자기소개", "self-introduction", "Let's begin the interview. Please introduce yourself and tell me a little about your daily life."),
  q("a-02", "집", "description", "Describe the place where you live. What does it look like, and which room do you like the most?"),
  q("a-03", "집", "routine", "What do you usually do at home on weekends? Walk me through a typical weekend at home."),
  q("a-04", "집", "past-experience", "Tell me about a time something unexpected happened at your home. What happened, and how did you handle it?"),
  q("a-05", "공원", "description", "Tell me about a park you often visit. Where is it, and what can people do there?"),
  q("a-06", "공원", "routine", "What do you usually do when you go to the park? Who do you go with?"),
  q("a-07", "공원", "past-experience", "Describe a memorable day you had at a park. What made that day special?"),
];

const easier: Question[] = [
  q("a-e08", "음악", "description", "What kind of music do you like? Why do you like it?"),
  q("a-e09", "음악", "routine", "When and where do you usually listen to music?"),
  q("a-e10", "음악", "past-experience", "Tell me about the first song you remember liking."),
  q("a-e11", "식당 예약", "roleplay-ask", "You want to have dinner at a new restaurant. Call the restaurant and ask two or three questions about it."),
  q("a-e12", "식당 예약", "roleplay-experience", "Tell me about a restaurant you enjoyed recently. What did you eat?"),
];

const similar: Question[] = [
  q("a-s08", "음악", "description", "Who is your favorite singer or musician? Describe their music and why you enjoy it."),
  q("a-s09", "음악", "change", "How has your taste in music changed since you were younger? What do you listen to now compared to before?"),
  q("a-s10", "음악", "past-experience", "Tell me about a time you saw live music. Where was it, who were you with, and how did you feel?"),
  q("a-s11", "식당 예약", "roleplay-ask", "You want to book a table for a family dinner this Saturday. Call the restaurant and ask three or four questions to make a reservation."),
  q("a-s12", "식당 예약", "roleplay-solve", "When you arrive, the restaurant has no record of your reservation. Explain the situation to the staff and suggest two or three solutions."),
  q("a-s13", "식당 예약", "roleplay-experience", "Have you ever had a problem at a restaurant? What happened, and how was it resolved?"),
  q("a-s14", "기술", "comparison", "Compare how people kept in touch with friends ten years ago with how they do it today. What has changed?"),
  q("a-s15", "기술", "issue", "Some people worry that smartphones make it hard to focus. What do people around you say about this issue?"),
];

const harder: Question[] = [
  q("a-h08", "음악", "change", "How has the way people discover new music changed over the years? Give specific examples."),
  q("a-h09", "음악", "issue", "Some people say streaming services are unfair to musicians. What do you think about this issue, and why?"),
  q("a-h10", "음악", "past-experience", "Tell me about a concert or performance that did not go as planned. What happened from beginning to end?"),
  q("a-h11", "식당 예약", "roleplay-ask", "A friend is visiting your city and asks you to organize a group dinner. Call a restaurant and ask detailed questions about menus, prices, and seating."),
  q("a-h12", "식당 예약", "roleplay-solve", "The restaurant cancels your group booking one hour before dinner. Call your friend, explain the situation, and propose alternatives."),
  q("a-h13", "식당 예약", "roleplay-experience", "Describe a time when you had to change plans at the last minute. How did you deal with it?"),
  q("a-h14", "기술", "comparison", "Compare the advantages and disadvantages of working from home and working in an office."),
  q("a-h15", "기술", "issue", "What social issues have new technologies created in your country, and how are people trying to solve them?"),
];

export const PRACTICE_SET_A: QuestionSet = {
  id: "set-a",
  version: 1,
  title: "자체 연습 세트 A",
  firstSession,
  secondSession: { easier, similar, harder },
};

export const QUESTION_SETS: readonly QuestionSet[] = [PRACTICE_SET_A];

export function findSet(setId: string): QuestionSet | undefined {
  return QUESTION_SETS.find((set) => set.id === setId);
}

export function findQuestion(set: QuestionSet, questionId: string): Question | undefined {
  const all = [...set.firstSession, ...Object.values(set.secondSession).flat()];
  return all.find((question) => question.id === questionId);
}
