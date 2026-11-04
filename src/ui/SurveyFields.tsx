import { MIN_SURVEY_TOPICS } from "../domain/generate";
import { QUESTION_POOL } from "../domain/question-pool-data";

import type { SelfAssessment } from "../domain/types";

const LEVELS: { value: SelfAssessment; text: string }[] = [
  { value: 1, text: "단어 몇 개로만 말할 수 있다" },
  { value: 2, text: "짧은 문장으로 기본적인 것을 말할 수 있다" },
  { value: 3, text: "익숙한 주제는 문장을 이어서 말할 수 있다" },
  { value: 4, text: "익숙한 주제는 자신 있게 길게 말할 수 있다" },
  { value: 5, text: "다양한 주제를 경험담으로 풀어 말할 수 있다" },
  { value: 6, text: "사회적 주제도 근거를 들어 논리적으로 말할 수 있다" },
];

type Props = {
  topicIds: string[];
  selfAssessment: SelfAssessment;
  onTopicsChange: (topicIds: string[]) => void;
  onSelfAssessmentChange: (level: SelfAssessment) => void;
};

export function SurveyFields({ topicIds, selfAssessment, onTopicsChange, onSelfAssessmentChange }: Props) {
  function toggle(topicId: string) {
    onTopicsChange(topicIds.includes(topicId) ? topicIds.filter((id) => id !== topicId) : [...topicIds, topicId]);
  }
  return (
    <>
      <fieldset>
        <legend>Background Survey · 관심 주제 ({MIN_SURVEY_TOPICS}개 이상)</legend>
        <p className="muted">고른 주제에서 1차 문항이 나오고, 고르지 않은 주제가 2차 돌발 문항으로 나옵니다.</p>
        <div className="topic-options">
          {QUESTION_POOL.topics.map((topic) => (
            <label key={topic.id} className="chip">
              <input type="checkbox" checked={topicIds.includes(topic.id)} onChange={() => toggle(topic.id)} />
              {topic.name}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend>Self Assessment · 내 말하기 수준</legend>
        {LEVELS.map((level) => (
          <label key={level.value}>
            <input
              type="radio"
              name="self-assessment"
              checked={selfAssessment === level.value}
              onChange={() => onSelfAssessmentChange(level.value)}
            />
            {level.value}단계 · {level.text}
          </label>
        ))}
      </fieldset>
    </>
  );
}
