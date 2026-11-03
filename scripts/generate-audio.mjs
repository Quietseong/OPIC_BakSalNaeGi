import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { transformWithEsbuild } from "vite";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "audio");
const force = process.argv.includes("--force");

async function loadQuestions() {
  const source = readFileSync(join(root, "src", "domain", "question-sets.ts"), "utf8");
  const { code } = await transformWithEsbuild(source, "question-sets.ts", { format: "esm" });
  const modulePath = join(tmpdir(), `opic-question-sets-${Date.now()}.mjs`);
  writeFileSync(modulePath, code);
  const { QUESTION_SETS } = await import(pathToFileURL(modulePath).href);
  return QUESTION_SETS.flatMap((set) => [...set.firstSession, ...Object.values(set.secondSession).flat()]);
}

const POWERSHELL_SCRIPT = `
param([string]$JobFile)
Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$voice = $synth.GetInstalledVoices() | Where-Object { $_.Enabled -and $_.VoiceInfo.Culture.Name -like 'en-*' } | Select-Object -First 1
if (-not $voice) { Write-Error 'No English Windows voice installed'; exit 2 }
$synth.SelectVoice($voice.VoiceInfo.Name)
$synth.Rate = -1
$format = New-Object System.Speech.AudioFormat.SpeechAudioFormatInfo(16000, [System.Speech.AudioFormat.AudioBitsPerSample]::Sixteen, [System.Speech.AudioFormat.AudioChannel]::Mono)
foreach ($job in (Get-Content -Raw -Encoding UTF8 $JobFile | ConvertFrom-Json)) {
  $synth.SetOutputToWaveFile($job.path, $format)
  $synth.Speak($job.text)
}
$synth.SetOutputToNull()
Write-Output $voice.VoiceInfo.Name
`;

const questions = await loadQuestions();
mkdirSync(outDir, { recursive: true });
const jobs = questions
  .map((question) => ({ path: join(outDir, `${question.id}.wav`), text: question.prompt }))
  .filter((job) => force || !existsSync(job.path));

if (jobs.length === 0) {
  console.log(`audio up to date: ${questions.length} files in ${outDir}`);
} else {
  const jobFile = join(tmpdir(), `opic-audio-jobs-${Date.now()}.json`);
  const scriptFile = join(tmpdir(), `opic-audio-${Date.now()}.ps1`);
  writeFileSync(jobFile, JSON.stringify(jobs), "utf8");
  writeFileSync(scriptFile, POWERSHELL_SCRIPT, "utf8");
  const voice = execFileSync("powershell.exe", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", scriptFile, jobFile], { encoding: "utf8" });
  console.log(`generated ${jobs.length} of ${questions.length} files with voice ${voice.trim()} in ${outDir}`);
}
