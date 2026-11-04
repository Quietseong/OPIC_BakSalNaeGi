import { useEffect, useState } from "react";

import { findModelAnswer } from "../domain/model-answers";
import { speak, stopSpeaking } from "../media/speech";
import { errorMessage } from "./format";

type Props = { questionId: string; isOpen?: boolean };

export function ModelAnswerPanel({ questionId, isOpen = false }: Props) {
  const answer = findModelAnswer(questionId);
  const [isFileMissing, setIsFileMissing] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  useEffect(() => stopSpeaking, []);
  if (!answer) return null;

  async function speakFallback() {
    if (!answer) return;
    setProblem(null);
    try {
      await speak(answer.text);
    } catch (error) {
      setProblem(errorMessage(error));
    }
  }

  return (
    <details className="model-answer" open={isOpen}>
      <summary>AL 모범 답안 (예시 인물: 서울 IT 회사원)</summary>
      <p className="muted">표현과 구성만 빌려 오세요. 내용은 내 경험으로 바꿔 말해야 합니다. 통째로 외운 답변은 Novice로 평가됩니다.</p>
      {isFileMissing ? (
        <button type="button" onClick={() => void speakFallback()}>브라우저 음성으로 듣기</button>
      ) : (
        <audio
          controls
          preload="none"
          src={`${import.meta.env.BASE_URL}audio/model/${answer.questionId}.wav`}
          onError={() => setIsFileMissing(true)}
          aria-label="모범 답안 음성"
        />
      )}
      <p className="model-text" lang="en">{answer.text}</p>
      <h3>AL로 들리는 이유</h3>
      <ul className="model-points">
        {answer.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
      {problem && <p className="error" role="alert">{problem}</p>}
    </details>
  );
}
