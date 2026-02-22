import { NextResponse } from "next/server";
import { getTopScores, insertScore } from "@/lib/db";
import { validateSubmission } from "@/lib/anticheat";
import type { ScoreSubmission } from "@/lib/anticheat";

export function GET() {
  const scores = getTopScores(10);
  return NextResponse.json(scores);
}

export async function POST(request: Request) {
  let body: ScoreSubmission;
  try {
    body = (await request.json()) as ScoreSubmission;
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  // validate anti-cheat
  const result = validateSubmission(body);
  if (!result.valid) {
    return NextResponse.json({ error: result.error }, { status: 403 });
  }

  // sanitize name
  const name = body.name.trim().toUpperCase().slice(0, 8);
  const duration = result.duration ?? 0;

  try {
    const row = insertScore(name, body.score, body.wave, duration);
    // return the inserted row + current leaderboard
    const scores = getTopScores(10);
    return NextResponse.json({ inserted: row, scores }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
