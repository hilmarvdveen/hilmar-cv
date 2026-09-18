import {
  FINISHED_FIT_JOB_KEY,
  PENDING_FIT_JOB_KEY,
  browserSessionStore,
  forgetFinishedFitJob,
  forgetPendingFitJob,
  markFinishedFitJobSeen,
  readFinishedFitJob,
  readPendingFitJob,
  rememberFinishedFitJob,
  rememberPendingFitJob,
  type FinishedFitJob,
  type KeyValueStore,
  type PendingFitJob,
} from "./job";

type Listener = () => void;

const listeners = new Set<Listener>();

type Cached<Value> = { raw: string | null; value: Value | null };

const pendingCache: Cached<PendingFitJob> = { raw: null, value: null };
const finishedCache: Cached<FinishedFitJob> = { raw: null, value: null };

function readRaw(store: KeyValueStore, key: string): string | null {
  try {
    return store.getItem(key);
  } catch {
    return null;
  }
}

function snapshot<Value>(
  cache: Cached<Value>,
  key: string,
  read: (store: KeyValueStore, now: number) => Value | null
): Value | null {
  const store = browserSessionStore();
  if (store === null) return null;
  const raw = readRaw(store, key);
  if (raw === cache.raw) return cache.value;
  cache.raw = raw;
  cache.value = raw === null ? null : read(store, Date.now());
  return cache.value;
}

export function subscribeToFitJobs(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function announceChange(): void {
  for (const listener of listeners) listener();
}

export function pendingFitJobSnapshot(): PendingFitJob | null {
  return snapshot(pendingCache, PENDING_FIT_JOB_KEY, readPendingFitJob);
}

export function finishedFitJobSnapshot(): FinishedFitJob | null {
  return snapshot(finishedCache, FINISHED_FIT_JOB_KEY, readFinishedFitJob);
}

export function noFitJobOnTheServer(): null {
  return null;
}

function changeTheStore(change: (store: KeyValueStore) => void): void {
  const store = browserSessionStore();
  if (store === null) return;
  change(store);
  announceChange();
}

export function startPendingFitJob(job: PendingFitJob): void {
  changeTheStore((store) => rememberPendingFitJob(store, job));
}

export function dropPendingFitJob(): void {
  changeTheStore(forgetPendingFitJob);
}

export function finishPendingFitJob(finished: FinishedFitJob): void {
  changeTheStore((store) => {
    forgetPendingFitJob(store);
    rememberFinishedFitJob(store, finished);
  });
}

export function showFinishedFitJob(finished: FinishedFitJob): void {
  changeTheStore((store) => rememberFinishedFitJob(store, finished));
}

export function markFinishedFitJobAsSeen(): void {
  changeTheStore((store) => markFinishedFitJobSeen(store, Date.now()));
}

export function dropFinishedFitJob(): void {
  changeTheStore(forgetFinishedFitJob);
}
