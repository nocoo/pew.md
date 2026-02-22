import type { Bullet, Vector2 } from "./types";
import { GAME_WIDTH, GAME_HEIGHT, TILE_SIZE } from "./types";

const BULLET_SPEED = 200;
const BULLET_SIZE = 3;

export function createBullet(
  origin: Vector2,
  direction: Vector2,
  fromPlayer: boolean,
): Bullet {
  // spawn bullet from center of the entity
  const halfTile = TILE_SIZE / 2;
  return {
    pos: {
      x: origin.x + halfTile - BULLET_SIZE / 2,
      y: origin.y + halfTile - BULLET_SIZE / 2,
    },
    size: BULLET_SIZE,
    alive: true,
    velocity: {
      x: direction.x * BULLET_SPEED,
      y: direction.y * BULLET_SPEED,
    },
    damage: 1,
    fromPlayer,
  };
}

export function updateBullets(bullets: Bullet[], dt: number): void {
  for (const bullet of bullets) {
    if (!bullet.alive) continue;

    bullet.pos.x += bullet.velocity.x * dt;
    bullet.pos.y += bullet.velocity.y * dt;

    // remove if out of bounds
    if (
      bullet.pos.x < -bullet.size ||
      bullet.pos.x > GAME_WIDTH + bullet.size ||
      bullet.pos.y < -bullet.size ||
      bullet.pos.y > GAME_HEIGHT + bullet.size
    ) {
      bullet.alive = false;
    }
  }
}

/** Remove dead bullets from the array (in-place) */
export function pruneDeadBullets(bullets: Bullet[]): Bullet[] {
  return bullets.filter((b) => b.alive);
}
