"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { GameEngine } from "@/game/engine";

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [wave, setWave] = useState(0);
  const [phase, setPhase] = useState<"title" | "playing" | "gameover">("title");

  const handleScoreChange = useCallback((s: number) => setScore(s), []);
  const handleLivesChange = useCallback((l: number) => setLives(l), []);
  const handleWaveChange = useCallback((w: number) => {
    setWave(w);
    setPhase("playing");
  }, []);
  const handleGameOver = useCallback((s: number) => {
    setScore(s);
    setPhase("gameover");
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new GameEngine(canvas);
    engineRef.current = engine;

    engine.setCallbacks({
      onScoreChange: handleScoreChange,
      onLivesChange: handleLivesChange,
      onWaveChange: handleWaveChange,
      onGameOver: handleGameOver,
    });

    engine.start();

    return () => {
      engine.stop();
      engineRef.current = null;
    };
  }, [handleScoreChange, handleLivesChange, handleWaveChange, handleGameOver]);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* HUD */}
      <div className="flex gap-6 font-mono text-sm text-[#f5f0e1]">
        <span>Score: {score}</span>
        <span>Wave: {wave}</span>
        <span>
          Lives:{" "}
          {Array.from({ length: lives }, (_, i) => (
            <span key={i} className="text-red-500">
              ♥
            </span>
          ))}
        </span>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="border-2 border-[#5b3a29] bg-black"
        tabIndex={0}
        onFocus={() => canvasRef.current?.focus()}
      />

      {/* Instructions */}
      {phase === "title" && (
        <p className="font-mono text-xs text-[#999]">
          Press SPACE to start — WASD / Arrow keys to move &amp; shoot
        </p>
      )}
    </div>
  );
}
