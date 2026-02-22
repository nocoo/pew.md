import { describe, test, expect } from "bun:test";
import { createPlayer, updatePlayer, hitPlayer } from "@/game/player";
import { createBullet, updateBullets, pruneDeadBullets } from "@/game/bullet";
import { createEnemy, updateEnemies, damageEnemy, pruneDeadEnemies } from "@/game/enemy";
import { checkCollision } from "@/game/collision";
import { createWaveState, updateWave, getEnemyTypeForWave } from "@/game/wave";
import { InputManager } from "@/game/input";
import type { GameState } from "@/game/types";

// simulate a minimal game loop without canvas/rendering
function createTestGameState(): GameState {
  return {
    phase: "playing",
    player: createPlayer(),
    bullets: [],
    enemies: [],
    powerUps: [],
    wave: createWaveState(),
    score: 0,
    time: 0,
  };
}

function createMockInput(dir: { x: number; y: number }): InputManager {
  const input = new InputManager();
  input.getDirection = () => dir;
  return input;
}

function simulateFrame(
  state: GameState,
  input: InputManager,
  dt: number,
): void {
  if (state.phase !== "playing") return;
  state.time += dt;

  // player
  const fireDir = updatePlayer(state.player, input, dt);
  if (fireDir) {
    state.bullets.push(createBullet(state.player.pos, fireDir, true));
  }

  // bullets
  updateBullets(state.bullets, dt);

  // wave
  const shouldSpawn = updateWave(state.wave, state.enemies.length, dt);
  if (shouldSpawn) {
    const type = getEnemyTypeForWave(state.wave.current);
    state.enemies.push(createEnemy(type));
  }

  // enemy movement
  updateEnemies(state.enemies, state.player.pos, dt);

  // bullet-enemy collision
  for (const bullet of state.bullets) {
    if (!bullet.alive || !bullet.fromPlayer) continue;
    for (const enemy of state.enemies) {
      if (!enemy.alive) continue;
      if (checkCollision(bullet, enemy)) {
        bullet.alive = false;
        const killed = damageEnemy(enemy, bullet.damage);
        if (killed) state.score += enemy.score;
        break;
      }
    }
  }

  // enemy-player collision
  for (const enemy of state.enemies) {
    if (!enemy.alive) continue;
    if (checkCollision(enemy, state.player)) {
      const wasHit = hitPlayer(state.player);
      if (wasHit) {
        enemy.alive = false;
        if (!state.player.alive) {
          state.phase = "gameover";
        }
      }
    }
  }

  state.bullets = pruneDeadBullets(state.bullets);
  state.enemies = pruneDeadEnemies(state.enemies);
}

describe("e2e: full game loop", () => {
  test("game starts in playing phase and can progress through waves", () => {
    const state = createTestGameState();
    const input = createMockInput({ x: 0, y: 0 }); // idle

    // simulate 3 seconds — wave should start
    for (let i = 0; i < 180; i++) {
      simulateFrame(state, input, 1 / 60);
    }

    expect(state.wave.current).toBeGreaterThanOrEqual(1);
  });

  test("player can shoot and kill enemies to gain score", () => {
    const state = createTestGameState();

    // place an enemy directly to the right of the player
    const enemy = createEnemy("basic");
    enemy.pos = { x: state.player.pos.x + 50, y: state.player.pos.y };
    state.enemies.push(enemy);

    // player shoots right
    const input = createMockInput({ x: 1, y: 0 });

    // simulate until bullet hits or 5 seconds
    for (let i = 0; i < 300; i++) {
      simulateFrame(state, input, 1 / 60);
      if (state.score > 0) break;
    }

    expect(state.score).toBeGreaterThan(0);
    expect(state.enemies.length).toBe(0);
  });

  test("enemy collision damages player and triggers gameover at 0 lives", () => {
    const state = createTestGameState();
    state.player.lives = 1;

    // place enemy on top of player
    const enemy = createEnemy("basic");
    enemy.pos = { ...state.player.pos };
    state.enemies.push(enemy);

    const input = createMockInput({ x: 0, y: 0 });
    simulateFrame(state, input, 1 / 60);

    expect(state.player.alive).toBe(false);
    expect(state.phase).toBe("gameover");
  });

  test("invincible player survives multiple enemy contacts", () => {
    const state = createTestGameState();
    state.player.invincibleTimer = 5; // 5 seconds of invincibility

    // spam enemies on player position
    for (let i = 0; i < 5; i++) {
      const enemy = createEnemy("basic");
      enemy.pos = { ...state.player.pos };
      state.enemies.push(enemy);
    }

    const input = createMockInput({ x: 0, y: 0 });
    simulateFrame(state, input, 1 / 60);

    expect(state.player.lives).toBe(3);
    expect(state.player.alive).toBe(true);
    // enemies should still be alive (no damage to player = no kill)
    expect(state.enemies.length).toBe(5);
  });

  test("complete game session: survive, score, die", () => {
    const state = createTestGameState();

    // phase 1: player moves and shoots right for 2 seconds
    const shootRight = createMockInput({ x: 1, y: 0 });
    for (let i = 0; i < 120; i++) {
      simulateFrame(state, shootRight, 1 / 60);
    }
    expect(state.player.alive).toBe(true);

    // phase 2: overwhelm with enemies
    state.player.lives = 1;
    state.player.invincibleTimer = 0;
    const enemy = createEnemy("basic");
    enemy.pos = { ...state.player.pos };
    state.enemies.push(enemy);

    const idle = createMockInput({ x: 0, y: 0 });
    simulateFrame(state, idle, 1 / 60);

    expect(state.phase).toBe("gameover");
  });
});
