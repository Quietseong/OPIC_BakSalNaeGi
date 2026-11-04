import { execFileSync } from "node:child_process";
import { createWriteStream, existsSync, mkdirSync, renameSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ttsDir = join(root, ".tts");
const venv = join(ttsDir, "venv");
const modelsDir = join(ttsDir, "models");
const RELEASE = "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0";
const MODEL_FILES = ["kokoro-v1.0.onnx", "voices-v1.0.bin"];

async function download(url, target) {
  const response = await fetch(url);
  if (!response.ok || !response.body) throw new Error(`download failed ${response.status}: ${url}`);
  const partial = `${target}.part`;
  await pipeline(Readable.fromWeb(response.body), createWriteStream(partial));
  renameSync(partial, target);
}

mkdirSync(modelsDir, { recursive: true });
if (!existsSync(venv)) execFileSync("uv", ["venv", venv, "--python", "3.12"], { stdio: "inherit" });
execFileSync("uv", ["pip", "install", "--python", join(venv, "Scripts", "python.exe"), "kokoro-onnx==0.6.1"], { stdio: "inherit" });
for (const file of MODEL_FILES) {
  const target = join(modelsDir, file);
  if (existsSync(target)) continue;
  console.log(`downloading ${file}`);
  await download(`${RELEASE}/${file}`, target);
}
console.log(`Kokoro ready in ${ttsDir}`);
