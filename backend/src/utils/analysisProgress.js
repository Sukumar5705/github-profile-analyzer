/**
 * analysisProgress.js
 *
 * Lightweight in-memory progress tracker for the GitHub analysis pipeline.
 * Keyed by lowercased username. Lets the GET /progress endpoint report
 * real backend stage changes while the POST /analyze request is still
 * in flight (Node's event loop serves the GET concurrently while the
 * POST awaits I/O).
 *
 * Not a persistence layer — purely for live UI feedback. Entries are
 * swept automatically so this never grows unbounded.
 */

const TTL_MS = 10 * 60 * 1000; // stale/abandoned entries swept after 10 min
const KEEP_AFTER_DONE_MS = 30_000; // keep a finished/failed entry briefly so the UI can read it

const store = new Map();

function key(username) {
    return String(username || '').toLowerCase();
}

function sweep() {
    const now = Date.now();
    for (const [k, v] of store) {
        if (now - v.updatedAt > TTL_MS) store.delete(k);
    }
}

export function startProgress(username) {
    sweep();
    const record = {
        stage: 'connect',
        message: 'Starting analysis…',
        done: false,
        error: null,
        updatedAt: Date.now(),
    };
    store.set(key(username), record);
    return record;
}

export function setStage(username, stage, message) {
    const record = store.get(key(username));
    if (!record) return;
    record.stage = stage;
    if (message) record.message = message;
    record.updatedAt = Date.now();
}

export function completeProgress(username) {
    const k = key(username);
    const record = store.get(k);
    if (!record) return;
    record.stage = 'report';
    record.done = true;
    record.updatedAt = Date.now();
    setTimeout(() => store.delete(k), KEEP_AFTER_DONE_MS);
}

export function failProgress(username, message) {
    const k = key(username);
    const record = store.get(k);
    if (!record) return;
    record.error = message || 'Analysis failed';
    record.done = true;
    record.updatedAt = Date.now();
    setTimeout(() => store.delete(k), KEEP_AFTER_DONE_MS);
}

export function getProgress(username) {
    return store.get(key(username)) || null;
}