import type { GameState } from "./types";
import { GAME_WIDTH, GAME_HEIGHT } from "./types";
import { InputManager } from "./input";
import { createPlayer, updatePlayer, hitPlayer } from "./player";
import { createBullet, updateBullets, pruneDeadBullets } from "./bullet";
import { createEnemy, updateEnemies, damageEnemy, pruneDeadEnemies } from "./enemy";
import { checkCollision } from "./collision";
import { createWaveState, updateWave, getEnemyTypeForWave } from "./wave";
import {
  drawSprite,
  getCowboySprite,
  ENEMY_BASIC,
} from "./sprites";

const SCALE = 2; // render at 2x for crisp pixels
const CANVAS_WIDTH = GAME_WIDTH * SCALE;
const CANVAS_HEIGHT = GAME_HEIGHT * SCALE;

const BULLET_COLOR = "#f1c40f";
const GROUND_COLOR = "#c2a35a";
const GROUND_DARK = "#b3944d";

export class GameEngine {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  // offscreen canvas for pixel-perfect rendering at native resolution
  private readonly offscreen: OffscreenCanvas;
  private readonly offCtx: OffscreenCanvasRenderingContext2D;
  private readonly input: InputManager;
  private state: GameState;
  private animFrameId: number | null = null;
  private lastTime = 0;
  private onScoreChange?: (score: number) => void;
  private onLivesChange?: (lives: number) => void;
  private onWaveChange?: (wave: number) => void;
  private onGameOver?: (score: number) => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;
    // CSS scaling with pixelated rendering
    this.canvas.style.width = `${CANVAS_WIDTH}px`;
    this.canvas.style.height = `${CANVAS_HEIGHT}px`;
    this.canvas.style.imageRendering = "pixelated";

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Failed to get 2D context");
    this.ctx = ctx;
    this.ctx.imageSmoothingEnabled = false;

    this.offscreen = new OffscreenCanvas(GAME_WIDTH, GAME_HEIGHT);
    const offCtx = this.offscreen.getContext("2d");
    if (!offCtx) throw new Error("Failed to get offscreen 2D context");
    this.offCtx = offCtx;
    this.offCtx.imageSmoothingEnabled = false;

    this.input = new InputManager();
    this.state = this.createInitialState();
  }

  private createInitialState(): GameState {
    return {
      phase: "title",
      player: createPlayer(),
      bullets: [],
      enemies: [],
      powerUps: [],
      wave: createWaveState(),
      score: 0,
      time: 0,
    };
  }

  setCallbacks(cbs: {
    onScoreChange?: (score: number) => void;
    onLivesChange?: (lives: number) => void;
    onWaveChange?: (wave: number) => void;
    onGameOver?: (score: number) => void;
  }): void {
    this.onScoreChange = cbs.onScoreChange;
    this.onLivesChange = cbs.onLivesChange;
    this.onWaveChange = cbs.onWaveChange;
    this.onGameOver = cbs.onGameOver;
  }

  start(): void {
    this.input.bind();
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  stop(): void {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.input.unbind();
  }

  private loop = (now: number): void => {
    const dt = Math.min((now - this.lastTime) / 1000, 0.05); // cap at 50ms
    this.lastTime = now;

    this.update(dt);
    this.render();
    this.input.endFrame();

    this.animFrameId = requestAnimationFrame(this.loop);
  };

  private update(dt: number): void {
    const { state } = this;

    if (state.phase === "title") {
      // press any key to start
      if (this.input.isJustDown(" ") || this.input.isJustDown("enter")) {
        state.phase = "playing";
        this.onLivesChange?.(state.player.lives);
        this.onWaveChange?.(1);
      }
      return;
    }

    if (state.phase === "gameover") {
      if (this.input.isJustDown(" ") || this.input.isJustDown("enter")) {
        this.state = this.createInitialState();
        this.state.phase = "playing";
        this.onScoreChange?.(0);
        this.onLivesChange?.(this.state.player.lives);
        this.onWaveChange?.(1);
      }
      return;
    }

    // --- playing ---
    state.time += dt;

    // player movement & shooting
    const fireDir = updatePlayer(state.player, this.input, dt);
    if (fireDir) {
      state.bullets.push(createBullet(state.player.pos, fireDir, true));
    }

    // bullets
    updateBullets(state.bullets, dt);

    // wave & enemy spawning
    const prevWave = state.wave.current;
    const shouldSpawn = updateWave(state.wave, state.enemies.length, dt);
    if (shouldSpawn) {
      const type = getEnemyTypeForWave(state.wave.current);
      state.enemies.push(createEnemy(type));
    }
    if (state.wave.current !== prevWave) {
      this.onWaveChange?.(state.wave.current);
    }

    // enemy movement
    updateEnemies(state.enemies, state.player.pos, dt);

    // collision: bullets vs enemies
    for (const bullet of state.bullets) {
      if (!bullet.alive || !bullet.fromPlayer) continue;
      for (const enemy of state.enemies) {
        if (!enemy.alive) continue;
        if (checkCollision(bullet, enemy)) {
          bullet.alive = false;
          const killed = damageEnemy(enemy, bullet.damage);
          if (killed) {
            state.score += enemy.score;
            this.onScoreChange?.(state.score);
          }
          break;
        }
      }
    }

    // collision: enemies vs player
    for (const enemy of state.enemies) {
      if (!enemy.alive) continue;
      if (checkCollision(enemy, state.player)) {
        const wasHit = hitPlayer(state.player);
        if (wasHit) {
          this.onLivesChange?.(state.player.lives);
          enemy.alive = false;
          if (!state.player.alive) {
            state.phase = "gameover";
            this.onGameOver?.(state.score);
          }
        }
      }
    }

    // prune dead entities
    state.bullets = pruneDeadBullets(state.bullets);
    state.enemies = pruneDeadEnemies(state.enemies);
  }

  private render(): void {
    const ctx = this.offCtx;
    const { state } = this;

    // clear with ground color
    ctx.fillStyle = GROUND_COLOR;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // draw ground pattern (subtle grid)
    ctx.fillStyle = GROUND_DARK;
    for (let y = 0; y < GAME_HEIGHT; y += 32) {
      for (let x = 0; x < GAME_WIDTH; x += 32) {
        if ((x / 32 + y / 32) % 2 === 0) {
          ctx.fillRect(x, y, 32, 32);
        }
      }
    }

    if (state.phase === "title") {
      this.renderTitle(ctx);
      this.blitToScreen();
      return;
    }

    // draw bullets
    ctx.fillStyle = BULLET_COLOR;
    for (const bullet of state.bullets) {
      if (!bullet.alive) continue;
      ctx.fillRect(
        Math.round(bullet.pos.x),
        Math.round(bullet.pos.y),
        bullet.size,
        bullet.size,
      );
    }

    // draw enemies
    for (const enemy of state.enemies) {
      if (!enemy.alive) continue;
      drawSprite(ctx, ENEMY_BASIC, enemy.pos.x, enemy.pos.y);
    }

    // draw player (blink when invincible)
    if (state.player.alive) {
      const blink =
        state.player.invincibleTimer > 0 &&
        Math.floor(state.player.invincibleTimer * 10) % 2 === 0;
      if (!blink) {
        const sprite = getCowboySprite(state.player.direction);
        drawSprite(ctx, sprite, state.player.pos.x, state.player.pos.y);
      }
    }

    if (state.phase === "gameover") {
      this.renderGameOver(ctx);
    }

    this.blitToScreen();
  }

  private renderTitle(ctx: OffscreenCanvasRenderingContext2D): void {
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    ctx.fillStyle = "#f5f0e1";
    ctx.font = "bold 16px monospace";
    ctx.textAlign = "center";
    ctx.fillText("PEW.MD", GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20);

    ctx.font = "8px monospace";
    ctx.fillText("Press SPACE to start", GAME_WIDTH / 2, GAME_HEIGHT / 2 + 10);
    ctx.fillText("WASD / Arrows to move & shoot", GAME_WIDTH / 2, GAME_HEIGHT / 2 + 25);
  }

  private renderGameOver(ctx: OffscreenCanvasRenderingContext2D): void {
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    ctx.fillStyle = "#c0392b";
    ctx.font = "bold 14px monospace";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", GAME_WIDTH / 2, GAME_HEIGHT / 2 - 15);

    ctx.fillStyle = "#f5f0e1";
    ctx.font = "10px monospace";
    ctx.fillText(`Score: ${this.state.score}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 5);

    ctx.font = "8px monospace";
    ctx.fillText("Press SPACE to retry", GAME_WIDTH / 2, GAME_HEIGHT / 2 + 25);
  }

  /** Scale the offscreen canvas onto the visible canvas */
  private blitToScreen(): void {
    this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.ctx.drawImage(this.offscreen, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
}
