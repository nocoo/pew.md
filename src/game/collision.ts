import type { Entity } from "./types";

/** AABB collision detection between two entities */
export function checkCollision(a: Entity, b: Entity): boolean {
  return (
    a.pos.x < b.pos.x + b.size &&
    a.pos.x + a.size > b.pos.x &&
    a.pos.y < b.pos.y + b.size &&
    a.pos.y + a.size > b.pos.y
  );
}
