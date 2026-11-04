import { useEffect, useRef } from "react";

export function LevelMeter({ stream }: { stream: MediaStream }) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const context = new AudioContext();
    const analyser = context.createAnalyser();
    analyser.fftSize = 512;
    context.createMediaStreamSource(stream).connect(analyser);
    const samples = new Uint8Array(analyser.fftSize);
    let frame = 0;
    const draw = () => {
      analyser.getByteTimeDomainData(samples);
      const peak = samples.reduce((max, value) => Math.max(max, Math.abs(value - 128)), 0) / 128;
      if (barRef.current) barRef.current.style.transform = `scaleX(${Math.min(1, peak * 2)})`;
      frame = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(frame);
      void context.close();
    };
  }, [stream]);

  return (
    <div className="level-meter" aria-hidden="true">
      <div ref={barRef} className="level-bar" />
    </div>
  );
}
