import type { Attempt, Session } from "../domain/types";

const DB_NAME = "opic-practice";
const DB_VERSION = 1;
const SESSIONS = "sessions";
const ATTEMPTS = "attempts";
const RECORDINGS = "recordings";
const BY_SESSION = "bySession";

export class StorageError extends Error {
  constructor(operation: string, cause: unknown) {
    super(`저장소 작업 실패: ${operation}`, { cause });
    this.name = "StorageError";
  }
}

function promisify<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function done(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error ?? new Error("transaction aborted"));
  });
}

function upgrade(db: IDBDatabase): void {
  db.createObjectStore(SESSIONS, { keyPath: "id" });
  const attempts = db.createObjectStore(ATTEMPTS, { keyPath: "id" });
  attempts.createIndex(BY_SESSION, "sessionId");
  db.createObjectStore(RECORDINGS);
}

export class PracticeStore {
  private constructor(private readonly db: IDBDatabase) {}

  static async open(factory: IDBFactory = indexedDB, name = DB_NAME): Promise<PracticeStore> {
    const request = factory.open(name, DB_VERSION);
    request.onupgradeneeded = () => upgrade(request.result);
    try {
      return new PracticeStore(await promisify(request));
    } catch (error) {
      throw new StorageError("open", error);
    }
  }

  close(): void {
    this.db.close();
  }

  private async write(operation: string, stores: string[], work: (tx: IDBTransaction) => void): Promise<void> {
    try {
      const tx = this.db.transaction(stores, "readwrite");
      work(tx);
      await done(tx);
    } catch (error) {
      throw new StorageError(operation, error);
    }
  }

  private async read<T>(operation: string, store: string, query: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
    try {
      return await promisify(query(this.db.transaction(store).objectStore(store)));
    } catch (error) {
      throw new StorageError(operation, error);
    }
  }

  saveSession(session: Session): Promise<void> {
    return this.write("saveSession", [SESSIONS], (tx) => tx.objectStore(SESSIONS).put(session));
  }

  getSession(id: string): Promise<Session | undefined> {
    return this.read("getSession", SESSIONS, (s) => s.get(id));
  }

  async listSessions(): Promise<Session[]> {
    const sessions = await this.read<Session[]>("listSessions", SESSIONS, (s) => s.getAll());
    return sessions.sort((a, b) => b.startedAt - a.startedAt);
  }

  saveAttempt(attempt: Attempt, recording: Blob): Promise<void> {
    return this.write("saveAttempt", [ATTEMPTS, RECORDINGS], (tx) => {
      tx.objectStore(ATTEMPTS).put(attempt);
      tx.objectStore(RECORDINGS).put(recording, attempt.id);
    });
  }

  async listAttempts(sessionId: string): Promise<Attempt[]> {
    const attempts = await this.read<Attempt[]>("listAttempts", ATTEMPTS, (s) =>
      s.index(BY_SESSION).getAll(sessionId),
    );
    return attempts.sort((a, b) => a.createdAt - b.createdAt);
  }

  getRecording(attemptId: string): Promise<Blob | undefined> {
    return this.read("getRecording", RECORDINGS, (s) => s.get(attemptId));
  }

  async updateNote(attemptId: string, note: string): Promise<void> {
    const attempt = await this.read<Attempt | undefined>("updateNote", ATTEMPTS, (s) => s.get(attemptId));
    if (!attempt) throw new StorageError("updateNote", new Error(`no attempt ${attemptId}`));
    await this.write("updateNote", [ATTEMPTS], (tx) => tx.objectStore(ATTEMPTS).put({ ...attempt, note }));
  }

  deleteAttempt(attemptId: string): Promise<void> {
    return this.write("deleteAttempt", [ATTEMPTS, RECORDINGS], (tx) => {
      tx.objectStore(ATTEMPTS).delete(attemptId);
      tx.objectStore(RECORDINGS).delete(attemptId);
    });
  }

  async deleteSession(sessionId: string): Promise<void> {
    const attempts = await this.listAttempts(sessionId);
    await this.write("deleteSession", [SESSIONS, ATTEMPTS, RECORDINGS], (tx) => {
      tx.objectStore(SESSIONS).delete(sessionId);
      for (const attempt of attempts) {
        tx.objectStore(ATTEMPTS).delete(attempt.id);
        tx.objectStore(RECORDINGS).delete(attempt.id);
      }
    });
  }
}

export function nextAttemptNo(attempts: Attempt[], questionId: string): number {
  const numbers = attempts.filter((attempt) => attempt.questionId === questionId).map((a) => a.attemptNo);
  return Math.max(0, ...numbers) + 1;
}
