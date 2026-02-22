import { createHmac, randomBytes } from "node:crypto";

// server-side secret; in production this should be from env
const SECRET = process.env.ANTICHEAT_SECRET ?? "pew-md-secret-2026";

// track used session IDs to prevent replay attacks
const usedSessions = new Set<string>();

// max used sessions to keep in memory (prevent memory leak)
const MAX_USED_SESSIONS = 10_000;

export interface SessionToken {
  sessionId: string;
  startTime: number; // unix timestamp ms
  token: string; // HMAC signature
}

/** Generate a new session token for a game start */
export function createSessionToken(): SessionToken {
  const sessionId = randomBytes(16).toString("hex");
  const startTime = Date.now();
  const token = sign(sessionId, startTime);
  return { sessionId, startTime, token };
}

/** Sign sessionId + startTime */
function sign(sessionId: string, startTime: number): string {
  return createHmac("sha256", SECRET)
    .update(`${sessionId}:${startTime}`)
    .digest("hex");
}

export interface ScoreSubmission {
  name: string;
  score: number;
  wave: number;
  sessionId: string;
  startTime: number;
  token: string;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  duration?: number; // game duration in seconds
}

/** Validate a score submission */
export function validateSubmission(sub: ScoreSubmission): ValidationResult {
  // 1. verify HMAC signature
  const expected = sign(sub.sessionId, sub.startTime);
  if (sub.token !== expected) {
    return { valid: false, error: "invalid token" };
  }

  // 2. check session hasn't been used (prevent replay)
  if (usedSessions.has(sub.sessionId)) {
    return { valid: false, error: "session already used" };
  }

  // 3. validate name format
  const nameTrimmed = sub.name.trim();
  if (nameTrimmed.length < 3 || nameTrimmed.length > 8) {
    return { valid: false, error: "name must be 3-8 characters" };
  }
  if (!/^[a-zA-Z0-9]+$/.test(nameTrimmed)) {
    return { valid: false, error: "name must be alphanumeric" };
  }

  // 4. basic range checks
  if (sub.score < 0 || sub.wave < 1) {
    return { valid: false, error: "invalid score or wave" };
  }

  // 5. duration plausibility
  const now = Date.now();
  const durationMs = now - sub.startTime;
  const durationSec = durationMs / 1000;

  if (durationSec < 2) {
    return { valid: false, error: "game too short" };
  }

  // 6. score vs wave plausibility
  // each wave has BASE(5) + wave*3 enemies, each worth 10-30 points
  // generous upper bound: 30 pts * (5 + wave*3) per wave, summed
  const maxScoreForWave = calculateMaxPlausibleScore(sub.wave);
  if (sub.score > maxScoreForWave) {
    return { valid: false, error: "score too high for wave" };
  }

  // 7. score vs duration plausibility
  // max ~200 points per second is extremely generous
  if (sub.score > durationSec * 200) {
    return { valid: false, error: "score rate too high" };
  }

  // mark session as used
  usedSessions.add(sub.sessionId);
  // prevent memory leak
  if (usedSessions.size > MAX_USED_SESSIONS) {
    const first = usedSessions.values().next().value;
    if (first) usedSessions.delete(first);
  }

  return { valid: true, duration: durationSec };
}

/** Calculate generous upper bound for score at a given wave */
function calculateMaxPlausibleScore(wave: number): number {
  let total = 0;
  for (let w = 1; w <= wave; w++) {
    const enemiesInWave = 5 + w * 3;
    // max 30 points per enemy (tank score)
    total += enemiesInWave * 30;
  }
  // add 50% buffer for nuke kills of spawned-but-not-counted enemies
  return Math.floor(total * 1.5);
}

/** Reset used sessions (for testing) */
export function _resetUsedSessions(): void {
  usedSessions.clear();
}
