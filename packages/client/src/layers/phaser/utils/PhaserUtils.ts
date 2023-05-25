import { tileCoordToPixelCoord } from "@latticexyz/phaserx";
import { TILE_HEIGHT, TILE_WIDTH } from "../constants";

export function buildTooltip(
  scene: Phaser.Scene,
  sprite: string,
  x: number,
  y: number,
  onClick: () => void
) {
  const pixelCoordinates = tileCoordToPixelCoord(
    { x, y },
    TILE_WIDTH,
    TILE_HEIGHT
  );

  return scene.add
    .sprite(pixelCoordinates.x, pixelCoordinates.y, sprite)
    .setOrigin(0, 0)
    .setDepth(15)
    .setInteractive()
    .setVisible(false)
    .on("pointerdown", onClick);
}

export function buildDialog(
  scene: Phaser.Scene,
  image: string,
  onClick: () => void
) {
  return scene.add
    .image(scene.cameras.main.width / 2, scene.cameras.main.height / 2, image)
    .setDepth(20)
    .setInteractive()
    .setVisible(false)
    .setScrollFactor(0)
    .on("pointerdown", onClick);
}
