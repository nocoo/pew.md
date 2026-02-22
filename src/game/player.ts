import type { Player, Vector2 } from "./types";
import { GAME_WIDTH, GAME_HEIGHT, TILE_SIZE } from "./types";
import type { InputManager } from "./input";

const PLAYER_SPEED = 80; // pixels per second
const BASE_FIRE_RATE = 4; // shots per second
const MOVING_FIRE_BONUS = 1.1; // 10% faster fire rate while moving
const RAPIDFIRE_MULTIPLIER = 2; // double fire rate with rapidfire power-up
const INVINCIBLE_DURATION = 1.5; // seconds after being hit

export function createPlayer(): Player {
  return {
    pos: {
      x: (GAME_WIDTH - TILE_SIZE) / 2,
      y: (GAME_HEIGHT - TILE_SIZE) / 2,
    },
    size: TILE_SIZE,
    alive: true,
    lives: 3,
    speed: PLAYER_SPEED,
    fireRate: BASE_FIRE_RATE,
    fireCooldown: 0,
    direction: { x: 0, y: 1 }, // face down initially
    invincibleTimer: 0,
    activePowerUps: [],
  };
}

/** Get effective fire rate considering movement and active power-ups */
export function getEffectiveFireRate(player: Player, isMoving: boolean): number {
  let rate = player.fireRate;
  if (isMoving) rate *= MOVING_FIRE_BONUS;
  if (player.activePowerUps.some((ap) => ap.kind === "rapidfire")) {
    rate *= RAPIDFIRE_MULTIPLIER;
  }
  return rate;
}

export function updatePlayer(
  player: Player,
  input: InputManager,
  dt: number,
): Vector2 | null {
  if (!player.alive) return null;

  const dir = input.getDirection();
  const isMoving = dir.x !== 0 || dir.y !== 0;

  // update facing direction (keep last direction when idle)
  if (isMoving) {
    player.direction = { x: dir.x, y: dir.y };

    // move player
    player.pos.x += dir.x * player.speed * dt;
    player.pos.y += dir.y * player.speed * dt;

    // clamp to game bounds
    player.pos.x = Math.max(0, Math.min(GAME_WIDTH - player.size, player.pos.x));
    player.pos.y = Math.max(0, Math.min(GAME_HEIGHT - player.size, player.pos.y));
  }

  // handle firing cooldown
  player.fireCooldown = Math.max(0, player.fireCooldown - dt);

  // handle invincibility
  player.invincibleTimer = Math.max(0, player.invincibleTimer - dt);

  // always auto-fire (standing or moving); moving gives bonus fire rate
  if (player.fireCooldown <= 0) {
    const effectiveRate = getEffectiveFireRate(player, isMoving);
    player.fireCooldown = 1 / effectiveRate;
    return { ...player.direction }; // return fire direction
  }

  return null;
}

export function hitPlayer(player: Player): boolean {
  if (player.invincibleTimer > 0) return false;
  player.lives -= 1;
  if (player.lives <= 0) {
    player.alive = false;
  } else {
    player.invincibleTimer = INVINCIBLE_DURATION;
  }
  return true;
}
