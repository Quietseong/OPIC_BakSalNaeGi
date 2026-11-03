const VOICE_WAIT_MS = 1500;
const MS_PER_CHAR = 150;
const SPEECH_SLACK_MS = 5000;

function englishVoices(): SpeechSynthesisVoice[] {
  return speechSynthesis.getVoices().filter((voice) => voice.lang.toLowerCase().startsWith("en"));
}

async function waitForVoices(): Promise<SpeechSynthesisVoice[]> {
  if (englishVoices().length > 0) return englishVoices();
  await new Promise<void>((resolve) => {
    const timer = setTimeout(resolve, VOICE_WAIT_MS);
    speechSynthesis.addEventListener("voiceschanged", () => {
      clearTimeout(timer);
      resolve();
    }, { once: true });
  });
  return englishVoices();
}

export async function speak(text: string): Promise<void> {
  if (typeof speechSynthesis === "undefined") throw new Error("음성 합성을 지원하지 않는 브라우저입니다.");
  const voices = await waitForVoices();
  if (voices.length === 0) throw new Error("영어 음성을 찾지 못했습니다.");
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = voices.find((voice) => voice.lang === "en-US") ?? voices[0] ?? null;
  utterance.lang = utterance.voice?.lang ?? "en-US";
  utterance.rate = 0.95;
  await new Promise<void>((resolve, reject) => {
    // Chrome sometimes never fires `end`; the guard keeps the question from hanging forever.
    const guard = setTimeout(resolve, text.length * MS_PER_CHAR + SPEECH_SLACK_MS);
    utterance.onend = () => {
      clearTimeout(guard);
      resolve();
    };
    utterance.onerror = (event) => {
      clearTimeout(guard);
      reject(new Error(`질문 재생 실패: ${event.error}`));
    };
    speechSynthesis.speak(utterance);
  });
}

export function stopSpeaking(): void {
  if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel();
}
