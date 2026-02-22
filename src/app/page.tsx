"use client";

import dynamic from "next/dynamic";

const GameCanvas = dynamic(() => import("@/components/GameCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center font-mono text-[#999]">
      Loading...
    </div>
  ),
});

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="font-mono text-3xl font-bold text-[#f5f0e1]">
        PEW.MD
      </h1>
      <GameCanvas />
    </main>
  );
}
