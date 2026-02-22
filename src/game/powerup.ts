import type { PowerUp, PowerUpKind, Player, Vector2, Bullet } from "./types";
import { checkCollision } from "./collision";
import { createBullet } from "./bullet";

const POWERUP_SIZE = 10;
const POWERUP_DROP_CHANCE = 0.25; // 25% chance on enemy kill
const POWERUP_MIN_WAVE = 3; // first wave that can drop power-ups

// duration of timed power-ups in seconds
const SPREAD_DURATION = 6;
const RAPIDFIRE_DURATION = 5;
const PIERCE_DURATION = 6;

const SPREAD_ANGLE = Math.PI / 8; // ~22.5 degrees offset per extra bullet

/** Check whether power-ups can drop for the given wave */
export function canDropPowerUp(wave: number): boolean {
  return wave >= POWERUP_MIN_WAVE;
}

/** Roll for a power-up drop at the enemy's death position */
export function trySpawnPowerUp(
  enemyPos: Vector2,
  wave: number,
): PowerUp | null {
  if (!canDropPowerUp(wave)) return null;
  if (Math.random() > POWERUP_DROP_CHANCE) return null;

  const kind = rollPowerUpKind(wave);
  return createPowerUp(kind, enemyPos);
}

/** Create a power-up entity */
export function createPowerUp(kind: PowerUpKind, pos: Vector2): PowerUp {
  const duration = getPowerUpDuration(kind);
  return {
    pos: { x: pos.x, y: pos.y },
    size: POWERUP_SIZE,
    alive: true,
    kind,
    duration,
  };
}

function getPowerUpDuration(kind: PowerUpKind): number {
  switch (kind) {
    case "spread":
      return SPREAD_DURATION;
    case "rapidfire":
      return RAPIDFIRE_DURATION;
    case "pierce":
      return PIERCE_DURATION;
    case "nuke":
      return 0; // instant effect
  }
}

/** Weighted random pick; nuke is rarer */
function rollPowerUpKind(wave: number): PowerUpKind {
  const roll = Math.random();
  // nuke only from wave 5+, and rare (10%)
  if (wave >= 5 && roll < 0.1) return "nuke";
  if (roll < 0.4) return "spread";
  if (roll < 0.7) return "rapidfire";
  return "pierce";
}

/** Check if player picks up any power-ups; returns collected ones */
export function collectPowerUps(
  player: Player,
  powerUps: PowerUp[],
): PowerUp[] {
  const collected: PowerUp[] = [];
  for (const pu of powerUps) {
    if (!pu.alive) continue;
    if (checkCollision(player, pu)) {
      pu.alive = false;
      collected.push(pu);
    }
  }
  return collected;
}

/** Apply a collected power-up to the player */
export function applyPowerUp(player: Player, powerUp: PowerUp): void {
  if (powerUp.kind === "nuke") {
    // nuke is handled by the engine (kills all enemies)
    return;
  }

  // remove existing power-up of same kind (refresh duration)
  player.activePowerUps = player.activePowerUps.filter(
    (ap) => ap.kind !== powerUp.kind,
  );
  player.activePowerUps.push({
    kind: powerUp.kind,
    remaining: powerUp.duration,
  });
}

/** Tick down active power-up durations on the player */
export function updateActivePowerUps(player: Player, dt: number): void {
  for (const ap of player.activePowerUps) {
    ap.remaining -= dt;
  }
  player.activePowerUps = player.activePowerUps.filter(
    (ap) => ap.remaining > 0,
  );
}

/** Check if player has a specific power-up active */
export function hasActivePowerUp(
  player: Player,
  kind: PowerUpKind,
): boolean {
  return player.activePowerUps.some((ap) => ap.kind === kind);
}

/** Remove dead power-ups from array */
export function pruneDeadPowerUps(powerUps: PowerUp[]): PowerUp[] {
  return powerUps.filter((pu) => pu.alive);
}

/** Create bullets based on active power-ups (spread/pierce) */
export function createPlayerBullets(
  player: Player,
  fireDir: Vector2,
): Bullet[] {
  const pierce = hasActivePowerUp(player, "pierce");
  const spread = hasActivePowerUp(player, "spread");

  if (spread) {
    // 3 bullets: center + two angled
    const angle = Math.atan2(fireDir.y, fireDir.x);
    const bullets: Bullet[] = [];

    for (const offset of [-SPREAD_ANGLE, 0, SPREAD_ANGLE]) {
      const a = angle + offset;
      const dir: Vector2 = { x: Math.cos(a), y: Math.sin(a) };
      bullets.push(createBullet(player.pos, dir, true, pierce));
    }
    return bullets;
  }

  return [createBullet(player.pos, fireDir, true, pierce)];
}
