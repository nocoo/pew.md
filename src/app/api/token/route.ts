import { NextResponse } from "next/server";
import { createSessionToken } from "@/lib/anticheat";

export function GET() {
  const session = createSessionToken();
  return NextResponse.json(session);
}
