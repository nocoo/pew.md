// pixel art sprites drawn procedurally via code
// each sprite is a 2D array of hex color strings (or "" for transparent)

export type SpriteData = readonly (readonly string[])[];

// color palette
const _ = ""; // transparent
const K = "#2a1f1e"; // dark outline
const S = "#c4956a"; // skin
const H = "#5b3a29"; // hat brown
const D = "#3e2723"; // hat dark
const W = "#f5f0e1"; // white (shirt)
const B = "#3b5dc9"; // blue jeans
const T = "#8b6914"; // tan/leather (belt, boots)
const R = "#c0392b"; // red bandana
const G = "#6d6d6d"; // gun metal

/** 16x16 cowboy facing down (idle) */
export const COWBOY_DOWN: SpriteData = [
  [_, _, _, _, _, H, H, H, H, H, H, _, _, _, _, _],
  [_, _, _, _, H, H, H, H, H, H, H, H, _, _, _, _],
  [_, _, _, H, H, H, H, H, H, H, H, H, H, _, _, _],
  [_, _, _, H, D, D, D, D, D, D, D, D, H, _, _, _],
  [_, _, _, _, K, S, S, S, S, S, S, K, _, _, _, _],
  [_, _, _, _, S, K, S, S, S, S, K, S, _, _, _, _],
  [_, _, _, _, S, S, S, S, S, S, S, S, _, _, _, _],
  [_, _, _, _, _, S, R, R, R, R, S, _, _, _, _, _],
  [_, _, _, _, _, W, W, W, W, W, W, _, _, _, _, _],
  [_, _, _, _, W, W, W, T, T, W, W, W, _, _, _, _],
  [_, _, _, _, W, W, W, T, T, W, W, W, _, _, _, _],
  [_, _, _, _, _, W, W, W, W, W, W, _, _, _, _, _],
  [_, _, _, _, _, B, B, B, B, B, B, _, _, _, _, _],
  [_, _, _, _, _, B, B, _, _, B, B, _, _, _, _, _],
  [_, _, _, _, _, B, B, _, _, B, B, _, _, _, _, _],
  [_, _, _, _, _, T, T, _, _, T, T, _, _, _, _, _],
];

/** 16x16 cowboy facing up */
export const COWBOY_UP: SpriteData = [
  [_, _, _, _, _, H, H, H, H, H, H, _, _, _, _, _],
  [_, _, _, _, H, H, H, H, H, H, H, H, _, _, _, _],
  [_, _, _, H, H, H, H, H, H, H, H, H, H, _, _, _],
  [_, _, _, H, D, D, D, D, D, D, D, D, H, _, _, _],
  [_, _, _, _, K, D, D, D, D, D, D, K, _, _, _, _],
  [_, _, _, _, S, D, D, D, D, D, D, S, _, _, _, _],
  [_, _, _, _, S, S, S, S, S, S, S, S, _, _, _, _],
  [_, _, _, _, _, S, S, S, S, S, S, _, _, _, _, _],
  [_, _, _, _, _, W, W, W, W, W, W, _, _, _, _, _],
  [_, _, _, _, W, W, W, T, T, W, W, W, _, _, _, _],
  [_, _, _, _, W, W, W, T, T, W, W, W, _, _, _, _],
  [_, _, _, _, _, W, W, W, W, W, W, _, _, _, _, _],
  [_, _, _, _, _, B, B, B, B, B, B, _, _, _, _, _],
  [_, _, _, _, _, B, B, _, _, B, B, _, _, _, _, _],
  [_, _, _, _, _, B, B, _, _, B, B, _, _, _, _, _],
  [_, _, _, _, _, T, T, _, _, T, T, _, _, _, _, _],
];

/** 16x16 cowboy facing right */
export const COWBOY_RIGHT: SpriteData = [
  [_, _, _, _, _, H, H, H, H, H, H, _, _, _, _, _],
  [_, _, _, _, H, H, H, H, H, H, H, H, _, _, _, _],
  [_, _, _, _, H, H, H, H, H, H, H, H, H, _, _, _],
  [_, _, _, _, H, D, D, D, D, D, D, D, H, _, _, _],
  [_, _, _, _, _, S, S, S, S, S, K, _, _, _, _, _],
  [_, _, _, _, _, S, S, S, S, K, S, _, _, _, _, _],
  [_, _, _, _, _, S, S, S, S, S, S, _, _, _, _, _],
  [_, _, _, _, _, _, S, R, R, S, _, _, _, _, _, _],
  [_, _, _, _, _, _, W, W, W, W, G, _, _, _, _, _],
  [_, _, _, _, _, W, W, T, T, W, G, G, _, _, _, _],
  [_, _, _, _, _, W, W, T, T, W, W, _, _, _, _, _],
  [_, _, _, _, _, _, W, W, W, W, _, _, _, _, _, _],
  [_, _, _, _, _, _, B, B, B, B, _, _, _, _, _, _],
  [_, _, _, _, _, _, B, B, B, B, _, _, _, _, _, _],
  [_, _, _, _, _, _, B, B, B, B, _, _, _, _, _, _],
  [_, _, _, _, _, _, T, T, T, T, _, _, _, _, _, _],
];

/** 16x16 cowboy facing left (mirror of right) */
export const COWBOY_LEFT: SpriteData = COWBOY_RIGHT.map((row) => [...row].reverse());

/** Simple enemy sprite — a bandit / outlaw */
const E = "#4a0e0e"; // dark red
const C = "#1a1a1a"; // black clothing
const F = "#d4a574"; // enemy skin

export const ENEMY_BASIC: SpriteData = [
  [_, _, _, _, _, _, C, C, C, C, _, _, _, _, _, _],
  [_, _, _, _, _, C, C, C, C, C, C, _, _, _, _, _],
  [_, _, _, _, C, C, C, C, C, C, C, C, _, _, _, _],
  [_, _, _, _, C, K, K, K, K, K, K, C, _, _, _, _],
  [_, _, _, _, _, F, F, F, F, F, F, _, _, _, _, _],
  [_, _, _, _, _, K, F, F, F, F, K, _, _, _, _, _],
  [_, _, _, _, _, F, F, F, F, F, F, _, _, _, _, _],
  [_, _, _, _, _, _, E, E, E, E, _, _, _, _, _, _],
  [_, _, _, _, _, C, C, C, C, C, C, _, _, _, _, _],
  [_, _, _, _, C, C, C, C, C, C, C, C, _, _, _, _],
  [_, _, _, _, C, C, C, C, C, C, C, C, _, _, _, _],
  [_, _, _, _, _, C, C, C, C, C, C, _, _, _, _, _],
  [_, _, _, _, _, C, C, C, C, C, C, _, _, _, _, _],
  [_, _, _, _, _, C, C, _, _, C, C, _, _, _, _, _],
  [_, _, _, _, _, C, C, _, _, C, C, _, _, _, _, _],
  [_, _, _, _, _, K, K, _, _, K, K, _, _, _, _, _],
];

// cache rendered ImageData so we don't redraw every frame
const spriteCache = new Map<SpriteData, ImageData>();

/** Render a SpriteData into an ImageData (cached) */
export function getSpriteImageData(sprite: SpriteData): ImageData {
  const cached = spriteCache.get(sprite);
  if (cached) return cached;

  const h = sprite.length;
  const w = sprite[0].length;
  const imageData = new ImageData(w, h);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const color = sprite[y][x];
      if (!color) continue;

      const idx = (y * w + x) * 4;
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      imageData.data[idx] = r;
      imageData.data[idx + 1] = g;
      imageData.data[idx + 2] = b;
      imageData.data[idx + 3] = 255;
    }
  }

  spriteCache.set(sprite, imageData);
  return imageData;
}

type RenderContext = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

/** Draw a sprite onto a canvas context at game coordinates */
export function drawSprite(
  ctx: RenderContext,
  sprite: SpriteData,
  x: number,
  y: number,
): void {
  const imageData = getSpriteImageData(sprite);
  ctx.putImageData(imageData, Math.round(x), Math.round(y));
}

/** Pick cowboy sprite based on facing direction */
export function getCowboySprite(dir: { x: number; y: number }): SpriteData {
  if (dir.x > 0.3) return COWBOY_RIGHT;
  if (dir.x < -0.3) return COWBOY_LEFT;
  if (dir.y < -0.3) return COWBOY_UP;
  return COWBOY_DOWN;
}
