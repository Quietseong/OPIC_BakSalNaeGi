import json
import sys
import wave

import numpy as np
from kokoro_onnx import Kokoro


def write_wav(path: str, samples: np.ndarray, sample_rate: int) -> None:
    pcm = (np.clip(samples, -1.0, 1.0) * 32767).astype(np.int16)
    with wave.open(path, "wb") as out:
        out.setnchannels(1)
        out.setsampwidth(2)
        out.setframerate(sample_rate)
        out.writeframes(pcm.tobytes())


def main() -> None:
    job_file, model, voices, voice, speed = sys.argv[1:6]
    kokoro = Kokoro(model, voices)
    with open(job_file, encoding="utf-8") as handle:
        jobs = json.load(handle)
    for index, job in enumerate(jobs, start=1):
        samples, sample_rate = kokoro.create(job["text"], voice=voice, speed=float(speed), lang="en-us")
        write_wav(job["path"], samples, sample_rate)
        print(f"{index}/{len(jobs)} {job['path']}", flush=True)


if __name__ == "__main__":
    main()
