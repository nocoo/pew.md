// game world coordinates and constants

export const GAME_WIDTH = 320;
export const GAME_HEIGHT = 320;
export const TILE_SIZE = 16;

export interface Vector2 {
  x: number;
  y: number;
}

export interface Entity {
  pos: Vector2;
  size: number;
  alive: boolean;
}

export type PowerUpKind = "spread" | "rapidfire" | "pierce" | "nuke";

export interface ActivePowerUp {
  kind: PowerUpKind;
  remaining: number; // seconds remaining
}

export interface Player extends Entity {
  lives: number;
  speed: number;
  fireRate: number; // shots per second
  fireCooldown: number; // remaining cooldown in seconds
  direction: Vector2; // last movement direction (also shoot direction)
  invincibleTimer: number; // seconds of invincibility remaining after hit
  activePowerUps: ActivePowerUp[]; // currently active timed power-ups
}

export interface Bullet extends Entity {
  velocity: Vector2;
  damage: number;
  fromPlayer: boolean;
  pierce: boolean; // whether bullet passes through enemies
}

export type EnemyType = "basic" | "fast" | "tank";

export interface Enemy extends Entity {
  type: EnemyType;
  speed: number;
  hp: number;
  maxHp: number;
  score: number; // points awarded on kill
}

export interface PowerUp extends Entity {
  kind: PowerUpKind;
  duration: number; // seconds of effect (0 = instant like nuke)
}

export interface WaveState {
  current: number;
  enemiesRemaining: number;
  spawnTimer: number;
  spawnInterval: number;
  betweenWaveTimer: number;
  active: boolean;
}

export type GamePhase = "title" | "playing" | "gameover";

export interface GameState {
  phase: GamePhase;
  player: Player;
  bullets: Bullet[];
  enemies: Enemy[];
  powerUps: PowerUp[];
  wave: WaveState;
  score: number;
  time: number; // total elapsed game time in seconds
}
