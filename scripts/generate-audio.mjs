import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { transformWithEsbuild } from "vite";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "audio");
const force = process.argv.includes("--force");

async function loadModule(relativePath) {
  const source = readFileSync(join(root, relativePath), "utf8");
  const { code } = await transformWithEsbuild(source, relativePath, { format: "esm" });
  const modulePath = join(tmpdir(), `opic-${Date.now()}-${relativePath.replace(/[\/]/g, "_")}.mjs`);
  writeFileSync(modulePath, code);
  return import(pathToFileURL(modulePath).href);
}

async function loadQuestions() {
  const { PRACTICE_SET_A } = await loadModule("src/domain/question-sets.ts");
  const { QUESTION_POOL } = await loadModule("src/domain/question-pool-data.ts");
  const { allPoolQuestions } = await loadModule("src/domain/generate.ts");
  const legacy = [...PRACTICE_SET_A.firstSession, ...Object.values(PRACTICE_SET_A.secondSession).flat()];
  return [...legacy, ...allPoolQuestions(QUESTION_POOL)];
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

const venvPython = join(root, ".tts", "venv", "Scripts", "python.exe");
const modelsDir = join(root, ".tts", "models");
const manifestPath = join(outDir, "manifest.json");

function option(name, fallback) {
  const arg = process.argv.find((value) => value.startsWith(`--${name}=`));
  return arg ? arg.slice(name.length + 3) : fallback;
}

const hasKokoro = existsSync(venvPython) && existsSync(join(modelsDir, "kokoro-v1.0.onnx"));
const engine = option("engine", hasKokoro ? "kokoro" : "windows");
const voice = engine === "kokoro" ? option("voice", "af_heart") : "windows-default";
const speed = option("speed", "0.95");
if (engine === "kokoro" && !hasKokoro) throw new Error("Kokoro is not installed. Run npm run tts:setup first.");

function synthesize(jobFile) {
  if (engine === "kokoro") {
    const args = [join(root, "scripts", "tts_kokoro.py"), jobFile, join(modelsDir, "kokoro-v1.0.onnx"), join(modelsDir, "voices-v1.0.bin"), voice, speed];
    execFileSync(venvPython, args, { stdio: "inherit" });
    return `kokoro ${voice}`;
  }
  const scriptFile = join(tmpdir(), `opic-audio-${Date.now()}.ps1`);
  writeFileSync(scriptFile, POWERSHELL_SCRIPT, "utf8");
  return execFileSync("powershell.exe", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", scriptFile, jobFile], { encoding: "utf8" }).trim();
}

const wanted = { engine, voice, speed: engine === "kokoro" ? speed : null };
const previous = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : null;
const voiceChanged = JSON.stringify(previous) !== JSON.stringify(wanted);

const questions = await loadQuestions();
mkdirSync(outDir, { recursive: true });
const jobs = questions
  .map((question) => ({ path: join(outDir, `${question.id}.wav`), text: question.prompt }))
  .filter((job) => force || voiceChanged || !existsSync(job.path));

if (jobs.length === 0) {
  console.log(`audio up to date: ${questions.length} files (${engine} ${voice}) in ${outDir}`);
} else {
  const jobFile = join(tmpdir(), `opic-audio-jobs-${Date.now()}.json`);
  writeFileSync(jobFile, JSON.stringify(jobs), "utf8");
  const used = synthesize(jobFile);
  writeFileSync(manifestPath, JSON.stringify(wanted), "utf8");
  console.log(`generated ${jobs.length} of ${questions.length} files with ${used} in ${outDir}`);
}
