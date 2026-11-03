export function formatDuration(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSec / 60);
  const seconds = totalSec % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString("ko-KR", { dateStyle: "short", timeStyle: "short" });
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
