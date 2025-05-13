export class GameCamera {
  private width: number;
  private height: number;
  private position = { x: 0, y: 0 };
  private zoom = 1;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  update(players: { x: number; y: number }[]) {
    const bounds = this.computeBounds(players);
    const target = {
      x: (bounds.minX + bounds.maxX) / 2,
      y: (bounds.minY + bounds.maxY) / 2,
    };
    const spanX = bounds.maxX - bounds.minX;
    const spanY = bounds.maxY - bounds.minY;
    const desiredZoom = 1 / Math.max(spanX / this.width, spanY / this.height, 0.1);

    this.position.x += (target.x - this.position.x) * 0.1;
    this.position.y += (target.y - this.position.y) * 0.1;
    this.zoom += (desiredZoom - this.zoom) * 0.1;
  }

  getMatrix(x: number, y: number): Float32Array {
    const scale = this.zoom;
    const tx = -this.position.x * scale + this.width / 2;
    const ty = -this.position.y * scale + this.height / 2;
    return new Float32Array([
      scale, 0, 0,
      0, scale, 0,
      tx, ty, 1,
    ]);
  }

  getViewMatrix(): Float32Array {
    const scale = this.zoom;
    const tx = -this.position.x * scale + this.width / 2;
    const ty = -this.position.y * scale + this.height / 2;
    return new Float32Array([
        scale, 0, 0,
        0, scale, 0,
        tx, ty, 1,
    ]);
  }

  private computeBounds(players: { x: number; y: number }[]) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const p of players) {
      minX = Math.min(minX, p.x);
      maxX = Math.max(maxX, p.x);
      minY = Math.min(minY, p.y);
      maxY = Math.max(maxY, p.y);
    }
    return { minX, minY, maxX, maxY };
  }
}