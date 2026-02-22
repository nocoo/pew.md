import type { Enemy, EnemyType, Vector2 } from "./types";
import { GAME_WIDTH, GAME_HEIGHT, TILE_SIZE } from "./types";

interface EnemyConfig {
  speed: number;
  hp: number;
  score: number;
}

const ENEMY_CONFIGS: Record<EnemyType, EnemyConfig> = {
  basic: { speed: 35, hp: 1, score: 10 },
  fast: { speed: 65, hp: 1, score: 15 },
  tank: { speed: 20, hp: 3, score: 30 },
};

/** Spawn an enemy at a random edge position */
export function createEnemy(type: EnemyType): Enemy {
  const config = ENEMY_CONFIGS[type];
  const pos = randomEdgePosition();

  return {
    pos,
    size: TILE_SIZE,
    alive: true,
    type,
    speed: config.speed,
    hp: config.hp,
    maxHp: config.hp,
    score: config.score,
  };
}

function randomEdgePosition(): Vector2 {
  const edge = Math.floor(Math.random() * 4);
  switch (edge) {
    case 0: // top
      return { x: Math.random() * (GAME_WIDTH - TILE_SIZE), y: -TILE_SIZE };
    case 1: // bottom
      return { x: Math.random() * (GAME_WIDTH - TILE_SIZE), y: GAME_HEIGHT };
    case 2: // left
      return { x: -TILE_SIZE, y: Math.random() * (GAME_HEIGHT - TILE_SIZE) };
    default: // right
      return { x: GAME_WIDTH, y: Math.random() * (GAME_HEIGHT - TILE_SIZE) };
  }
}

/** Move enemies toward the player */
export function updateEnemies(
  enemies: Enemy[],
  playerPos: Vector2,
  dt: number,
): void {
  for (const enemy of enemies) {
    if (!enemy.alive) continue;

    const dx = playerPos.x - enemy.pos.x;
    const dy = playerPos.y - enemy.pos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 1) {
      enemy.pos.x += (dx / dist) * enemy.speed * dt;
      enemy.pos.y += (dy / dist) * enemy.speed * dt;
    }
  }
}

export function damageEnemy(enemy: Enemy, damage: number): boolean {
  enemy.hp -= damage;
  if (enemy.hp <= 0) {
    enemy.alive = false;
    return true; // killed
  }
  return false;
}

export function pruneDeadEnemies(enemies: Enemy[]): Enemy[] {
  return enemies.filter((e) => e.alive);
}
