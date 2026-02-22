// keyboard input manager — tracks pressed keys each frame

export class InputManager {
  private readonly pressed = new Set<string>();
  private readonly justPressed = new Set<string>();
  private bound = false;

  private readonly onKeyDown = (e: KeyboardEvent): void => {
    const key = e.key.toLowerCase();
    if (!this.pressed.has(key)) {
      this.justPressed.add(key);
    }
    this.pressed.add(key);

    // prevent arrow keys from scrolling the page
    if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(key)) {
      e.preventDefault();
    }
  };

  private readonly onKeyUp = (e: KeyboardEvent): void => {
    this.pressed.delete(e.key.toLowerCase());
  };

  bind(): void {
    if (this.bound) return;
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    this.bound = true;
  }

  unbind(): void {
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    this.pressed.clear();
    this.justPressed.clear();
    this.bound = false;
  }

  /** Call at the end of each frame to reset just-pressed state */
  endFrame(): void {
    this.justPressed.clear();
  }

  isDown(key: string): boolean {
    return this.pressed.has(key.toLowerCase());
  }

  isJustDown(key: string): boolean {
    return this.justPressed.has(key.toLowerCase());
  }

  /** Returns normalized direction vector from WASD / arrow keys */
  getDirection(): { x: number; y: number } {
    let x = 0;
    let y = 0;

    if (this.isDown("w") || this.isDown("arrowup")) y -= 1;
    if (this.isDown("s") || this.isDown("arrowdown")) y += 1;
    if (this.isDown("a") || this.isDown("arrowleft")) x -= 1;
    if (this.isDown("d") || this.isDown("arrowright")) x += 1;

    // normalize diagonal movement
    const len = Math.sqrt(x * x + y * y);
    if (len > 0) {
      x /= len;
      y /= len;
    }

    return { x, y };
  }
}
