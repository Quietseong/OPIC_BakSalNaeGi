import type { QuestionType } from "./types";

export type Chunk = { en: string; ko: string };

export type Coaching = {
  label: string;
  skeleton: string[];
  chunks: Chunk[];
};

const EXPERIENCE: Coaching = {
  label: "경험",
  skeleton: [
    "언제·어디서·누구와: 배경을 한두 문장으로",
    "무슨 일이 있었나: 순서대로, 과거 시제로",
    "어떻게 대처했나 또는 어떤 기분이었나",
    "그래서 지금 느끼는 점으로 마무리",
  ],
  chunks: [
    { en: "I remember one time when ...", ko: "~했던 때가 기억나요" },
    { en: "It was about two years ago.", ko: "2년쯤 전이었어요" },
    { en: "At first, I didn't know what to do.", ko: "처음엔 어떻게 할지 몰랐어요" },
    { en: "So what I did was ...", ko: "그래서 제가 한 건 ~였어요" },
    { en: "In the end, it turned out fine.", ko: "결국 잘 해결됐어요" },
    { en: "Looking back, it was a good lesson.", ko: "돌아보면 좋은 교훈이었어요" },
  ],
};

export const COACHING: Record<QuestionType, Coaching> = {
  "self-introduction": {
    label: "자기소개",
    skeleton: ["이름 대신 지금 하는 일이나 상황", "사는 곳과 함께 사는 사람", "요즘 즐겨 하는 것 한두 가지", "앞으로 하고 싶은 것으로 마무리"],
    chunks: [
      { en: "Let me tell you a little bit about myself.", ko: "제 소개를 조금 할게요" },
      { en: "These days, I'm working as ...", ko: "요즘 저는 ~로 일하고 있어요" },
      { en: "I live in ... with my family.", ko: "가족과 ~에 살아요" },
      { en: "In my free time, I usually ...", ko: "여가 시간에는 보통 ~해요" },
      { en: "That's pretty much it about me.", ko: "저에 대해서는 이 정도예요" },
    ],
  },
  description: {
    label: "묘사",
    skeleton: ["한 문장 요약: 무엇이고 어디 있나", "겉모습·분위기를 감각으로 2~3가지", "내가 좋아하는 이유", "한 줄 마무리"],
    chunks: [
      { en: "The place I want to talk about is ...", ko: "제가 말하려는 곳은 ~예요" },
      { en: "It's located near ...", ko: "~ 근처에 있어요" },
      { en: "When you walk in, the first thing you notice is ...", ko: "들어가면 가장 먼저 눈에 띄는 건 ~예요" },
      { en: "It has a really cozy atmosphere.", ko: "분위기가 정말 아늑해요" },
      { en: "What I like most about it is ...", ko: "가장 좋아하는 점은 ~예요" },
      { en: "That's why I go there so often.", ko: "그래서 자주 가요" },
    ],
  },
  routine: {
    label: "루틴",
    skeleton: ["보통 언제·얼마나 자주", "먼저 → 그다음 → 마지막 순서로", "함께하는 사람이나 특별한 습관", "그 루틴이 주는 좋은 점"],
    chunks: [
      { en: "I usually ... about twice a week.", ko: "보통 일주일에 두 번쯤 ~해요" },
      { en: "First of all, I ...", ko: "먼저 ~해요" },
      { en: "After that, I ...", ko: "그다음에 ~해요" },
      { en: "Once I'm done, I ...", ko: "다 끝나면 ~해요" },
      { en: "It helps me relax after a long day.", ko: "긴 하루 끝에 긴장을 풀어 줘요" },
    ],
  },
  change: {
    label: "변화",
    skeleton: ["예전에는 어땠나", "지금은 어떤가", "가장 큰 차이 한두 가지와 이유", "그 변화에 대한 내 생각"],
    chunks: [
      { en: "In the past, people used to ...", ko: "예전에는 사람들이 ~하곤 했어요" },
      { en: "These days, however, ...", ko: "하지만 요즘은 ~" },
      { en: "The biggest difference is ...", ko: "가장 큰 차이는 ~예요" },
      { en: "I think this is because ...", ko: "제 생각엔 ~ 때문이에요" },
      { en: "Personally, I think it's a good change.", ko: "개인적으로 좋은 변화라고 생각해요" },
    ],
  },
  "past-experience": EXPERIENCE,
  "roleplay-experience": EXPERIENCE,
  "roleplay-ask": {
    label: "롤플레이 · 질문하기",
    skeleton: ["인사하고 전화한 이유 말하기", "질문 3~4개를 하나씩", "답을 들은 척 짧게 반응", "감사 인사로 끝내기"],
    chunks: [
      { en: "Hi, I'm calling because ...", ko: "안녕하세요, ~ 때문에 전화했어요" },
      { en: "I have a few questions about ...", ko: "~에 대해 몇 가지 여쭤볼게요" },
      { en: "First, could you tell me ...?", ko: "먼저 ~를 알려 주실 수 있나요?" },
      { en: "Also, I was wondering if ...", ko: "그리고 ~인지 궁금해요" },
      { en: "Oh, I see. That sounds great.", ko: "아, 그렇군요. 좋네요" },
      { en: "Thank you so much for your help.", ko: "도와주셔서 정말 감사해요" },
    ],
  },
  "roleplay-solve": {
    label: "롤플레이 · 문제 해결",
    skeleton: ["상황 설명: 무엇이 잘못됐나", "내가 원하는 것", "대안 2~3개 제안", "정중하게 마무리"],
    chunks: [
      { en: "I'm sorry to bother you, but there's a problem.", ko: "번거롭게 해서 죄송하지만 문제가 있어요" },
      { en: "The thing is, ...", ko: "사정이 뭐냐면요, ~" },
      { en: "Would it be possible to ...?", ko: "~하는 게 가능할까요?" },
      { en: "If that doesn't work, maybe we could ...", ko: "그게 안 되면 ~하면 어떨까요" },
      { en: "Another option would be to ...", ko: "또 다른 방법은 ~예요" },
      { en: "Please let me know what works best.", ko: "어떤 게 가장 좋은지 알려 주세요" },
    ],
  },
  comparison: {
    label: "비교",
    skeleton: ["비교할 두 가지를 먼저 소개", "공통점 하나", "차이점 두 가지와 구체적 예", "내 의견으로 마무리"],
    chunks: [
      { en: "If I compare A and B, ...", ko: "A와 B를 비교하면 ~" },
      { en: "Both of them are ...", ko: "둘 다 ~해요" },
      { en: "On the other hand, ...", ko: "반면에 ~" },
      { en: "For example, ...", ko: "예를 들면 ~" },
      { en: "Overall, I prefer ... because ...", ko: "전체적으로 ~ 때문에 ~가 더 좋아요" },
    ],
  },
  issue: {
    label: "이슈",
    skeleton: ["어떤 문제인지 한 문장으로", "왜 생기나 (원인 1~2개)", "사람들이 하는 말이나 내 주변 예", "해결 방법과 내 생각"],
    chunks: [
      { en: "These days, many people are worried about ...", ko: "요즘 많은 사람이 ~를 걱정해요" },
      { en: "One of the main reasons is ...", ko: "주된 이유 중 하나는 ~예요" },
      { en: "For instance, a friend of mine ...", ko: "예를 들어 제 친구는 ~" },
      { en: "To solve this problem, we need to ...", ko: "이 문제를 해결하려면 ~해야 해요" },
      { en: "In my opinion, ...", ko: "제 생각에는 ~" },
    ],
  },
};
