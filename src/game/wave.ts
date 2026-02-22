import type { WaveState, EnemyType } from "./types";

const BASE_ENEMIES = 5;
const ENEMIES_PER_WAVE = 3;
const SPAWN_INTERVAL_BASE = 1.2; // seconds between spawns
const SPAWN_INTERVAL_MIN = 0.3;
const BETWEEN_WAVE_DELAY = 2.0; // seconds between waves

export function createWaveState(): WaveState {
  return {
    current: 0,
    enemiesRemaining: 0,
    spawnTimer: 0,
    spawnInterval: SPAWN_INTERVAL_BASE,
    betweenWaveTimer: BETWEEN_WAVE_DELAY,
    active: false,
  };
}

export function startNextWave(wave: WaveState): void {
  wave.current += 1;
  wave.enemiesRemaining = BASE_ENEMIES + wave.current * ENEMIES_PER_WAVE;
  wave.spawnInterval = Math.max(
    SPAWN_INTERVAL_MIN,
    SPAWN_INTERVAL_BASE - wave.current * 0.05,
  );
  wave.spawnTimer = 0;
  wave.betweenWaveTimer = 0;
  wave.active = true;
}

/** Pick enemy type based on wave number */
export function getEnemyTypeForWave(waveNumber: number): EnemyType {
  const roll = Math.random();

  if (waveNumber >= 5 && roll < 0.15) return "tank";
  if (waveNumber >= 3 && roll < 0.35) return "fast";
  return "basic";
}

/** Returns true when an enemy should be spawned this frame */
export function updateWave(
  wave: WaveState,
  activeEnemyCount: number,
  dt: number,
): boolean {
  if (!wave.active) {
    // between waves
    wave.betweenWaveTimer += dt;
    if (wave.betweenWaveTimer >= BETWEEN_WAVE_DELAY) {
      startNextWave(wave);
    }
    return false;
  }

  if (wave.enemiesRemaining <= 0) {
    // all enemies spawned; wait for them to be cleared
    if (activeEnemyCount <= 0) {
      wave.active = false;
      wave.betweenWaveTimer = 0;
    }
    return false;
  }

  wave.spawnTimer += dt;
  if (wave.spawnTimer >= wave.spawnInterval) {
    wave.spawnTimer -= wave.spawnInterval;
    wave.enemiesRemaining -= 1;
    return true;
  }

  return false;
}
