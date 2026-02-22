"use client";

import { useState, useRef, useEffect } from "react";

interface NameInputProps {
  score: number;
  onSubmit: (name: string) => void;
  onSkip: () => void;
  submitting: boolean;
}

export default function NameInput({ score, onSubmit, onSkip, submitting }: NameInputProps) {
  const [name, setName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // focus the input when the component mounts
    // small delay to ensure canvas has released focus
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim().toUpperCase();
    if (trimmed.length >= 1 && trimmed.length <= 6) {
      onSubmit(trimmed);
    }
  };

  const valid = /^[a-zA-Z0-9]{1,6}$/.test(name.trim());

  return (
    <div className="flex flex-col items-center gap-3 rounded border border-[#5b3a29] bg-[#1a1510] px-5 py-4 font-mono">
      <p className="text-xs text-[#c4956a]">GAME OVER</p>
      <p className="text-lg font-bold text-[#f1c40f]">
        {score.toLocaleString()}
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2">
        <label className="text-xs text-[#999]">Enter your name</label>
        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 6))}
          placeholder="ACE"
          maxLength={6}
          disabled={submitting}
          className="w-28 rounded border border-[#5b3a29] bg-[#111] px-2 py-1 text-center text-sm uppercase tracking-widest text-[#f5f0e1] placeholder-[#555] outline-none focus:border-[#f1c40f]"
          // prevent game input while typing
          onKeyDown={(e) => e.stopPropagation()}
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!valid || submitting}
            className="rounded bg-[#5b3a29] px-3 py-1 text-xs text-[#f5f0e1] hover:bg-[#7a5035] disabled:opacity-40"
          >
            {submitting ? "..." : "SAVE"}
          </button>
          <button
            type="button"
            onClick={onSkip}
            disabled={submitting}
            className="rounded border border-[#333] px-3 py-1 text-xs text-[#666] hover:text-[#999]"
          >
            SKIP
          </button>
        </div>
      </form>
      <p className="text-[8px] text-[#555]">1-6 alphanumeric characters</p>
    </div>
  );
}
