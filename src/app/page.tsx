"use client";

import dynamic from "next/dynamic";
import { useState, useCallback } from "react";
import Leaderboard from "@/components/Leaderboard";

const GameCanvas = dynamic(() => import("@/components/GameCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[640px] w-[640px] items-center justify-center font-mono text-[#999]">
      Loading...
    </div>
  ),
});

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [highlightId, setHighlightId] = useState<number | undefined>();

  const handleScoreSubmitted = useCallback((insertedId: number) => {
    setHighlightId(insertedId);
    setRefreshKey((k) => k + 1);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="font-mono text-3xl font-bold text-[#f5f0e1]">
        PEW.MD
      </h1>
      <div className="flex items-start gap-6">
        <GameCanvas onScoreSubmitted={handleScoreSubmitted} />
        <Leaderboard refreshKey={refreshKey} highlightId={highlightId} />
      </div>
    </main>
  );
}
