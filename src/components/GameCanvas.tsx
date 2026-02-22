"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { GameEngine } from "@/game/engine";
import NameInput from "./NameInput";

interface SessionToken {
  sessionId: string;
  startTime: number;
  token: string;
}

interface GameCanvasProps {
  onScoreSubmitted: (insertedId: number) => void;
}

export default function GameCanvas({ onScoreSubmitted }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const sessionRef = useRef<SessionToken | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [wave, setWave] = useState(0);
  const [phase, setPhase] = useState<"title" | "playing" | "gameover">("title");
  const [showNameInput, setShowNameInput] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /** Fetch a session token from the server */
  const fetchSessionToken = useCallback(async () => {
    try {
      const res = await fetch("/api/token");
      if (res.ok) {
        sessionRef.current = (await res.json()) as SessionToken;
      }
    } catch {
      // silently fail; score just won't be saved
    }
  }, []);

  const handleScoreChange = useCallback((s: number) => setScore(s), []);
  const handleLivesChange = useCallback((l: number) => setLives(l), []);
  const handleWaveChange = useCallback((w: number) => {
    setWave(w);
    setPhase("playing");
    // fetch token on first wave (game start)
    if (w === 1) {
      void fetchSessionToken();
    }
  }, [fetchSessionToken]);

  const handleGameOver = useCallback((s: number) => {
    setScore(s);
    setPhase("gameover");
    setShowNameInput(true);
  }, []);

  const submitScore = useCallback(async (name: string) => {
    const session = sessionRef.current;
    if (!session) {
      setShowNameInput(false);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          score,
          wave,
          sessionId: session.sessionId,
          startTime: session.startTime,
          token: session.token,
        }),
      });

      if (res.ok) {
        const data = (await res.json()) as { inserted: { id: number } };
        onScoreSubmitted(data.inserted.id);
      }
    } catch {
      // silently fail
    } finally {
      setSubmitting(false);
      setShowNameInput(false);
      sessionRef.current = null;
    }
  }, [score, wave, onScoreSubmitted]);

  const skipScore = useCallback(() => {
    setShowNameInput(false);
    sessionRef.current = null;
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
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="block border-2 border-[#5b3a29] bg-black"
        tabIndex={0}
        onFocus={() => canvasRef.current?.focus()}
      />

      {/* HUD overlay — top */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 flex justify-center gap-6 px-3 py-2 font-mono text-xs text-[#f5f0e1] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
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

      {/* Title instructions overlay — center */}
      {phase === "title" && (
        <div className="pointer-events-none absolute bottom-8 left-0 right-0 text-center font-mono text-xs text-[#999]">
          Press SPACE to start — WASD / Arrow keys to move &amp; shoot
        </div>
      )}

      {/* Name input overlay on game over */}
      {showNameInput && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
          <NameInput
            score={score}
            onSubmit={submitScore}
            onSkip={skipScore}
            submitting={submitting}
          />
        </div>
      )}
    </div>
  );
}
