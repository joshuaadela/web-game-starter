import * as Phaser from "phaser";

/**
 * Floating touch joystick: appears wherever the thumb lands on the left half
 * of the screen. Outputs a direction vector with length 0..1.
 */
export class VirtualJoystick {
  dx = 0;
  dy = 0;
  private pointerId: number | null = null;
  private origin = new Phaser.Math.Vector2();
  private base: Phaser.GameObjects.Arc;
  private knob: Phaser.GameObjects.Arc;
  private readonly maxDist = 60;

  constructor(scene: Phaser.Scene) {
    this.base = scene.add.circle(0, 0, this.maxDist, 0xffffff, 0.12).setScrollFactor(0).setDepth(1000).setVisible(false);
    this.knob = scene.add.circle(0, 0, 26, 0xffffff, 0.35).setScrollFactor(0).setDepth(1001).setVisible(false);
    scene.input.addPointer(2); // allow multi-touch (move + future action buttons)

    scene.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
      if (this.pointerId !== null || !p.wasTouch || p.x > scene.scale.width / 2) return;
      this.pointerId = p.id;
      this.origin.set(p.x, p.y);
      this.base.setPosition(p.x, p.y).setVisible(true);
      this.knob.setPosition(p.x, p.y).setVisible(true);
    });
    scene.input.on("pointermove", (p: Phaser.Input.Pointer) => {
      if (p.id !== this.pointerId) return;
      const v = new Phaser.Math.Vector2(p.x - this.origin.x, p.y - this.origin.y);
      const len = Math.min(v.length(), this.maxDist);
      v.normalize().scale(len);
      this.knob.setPosition(this.origin.x + v.x, this.origin.y + v.y);
      this.dx = v.x / this.maxDist;
      this.dy = v.y / this.maxDist;
    });
    const release = (p: Phaser.Input.Pointer) => {
      if (p.id !== this.pointerId) return;
      this.pointerId = null;
      this.dx = this.dy = 0;
      this.base.setVisible(false);
      this.knob.setVisible(false);
    };
    scene.input.on("pointerup", release);
    scene.input.on("pointerupoutside", release);
  }
}
