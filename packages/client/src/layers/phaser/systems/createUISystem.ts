import { Assets } from "../constants";
import { PhaserLayer } from "../createPhaserLayer";

export const createUISystem = (layer: PhaserLayer) => {
  const {
    superfluid,
    game: { scale },
    scenes: {
      Main: { phaserScene },
    },
  } = layer;

  const token1 = addText("This is a test", 50, 10);
  const token2 = addText("This is a test", 50, 60);
  const token3 = addText("This is a test", 50, 110);
  const token4 = addText("This is a test", 50, 160);

  const icon1 = addAssetIcon(1, 10, 10);
  const icon2 = addAssetIcon(2, 10, 60);
  const icon3 = addAssetIcon(3, 10, 110);
  const icon4 = addAssetIcon(4, 10, 160);

  function addText(label: string, x: number, y: number) {
    return phaserScene.add
      .text(x, y, label, {
        color: "#ffffff",
        fontSize: "24px",
        fontFamily: "VT323",
      })
      .setOrigin(0, 0)
      .setDepth(10)
      .setScrollFactor(0);
  }

  function addAssetIcon(frame: number, x: number, y: number) {
    return phaserScene.add
      .sprite(x, y, Assets.Crystals, frame)
      .setOrigin(0, 0)
      .setDepth(10)
      .setScrollFactor(0);
  }
  console.log("Game viewport", scale.gameSize);

  // const backdrop = phaserScene.add
  //   .rectangle(0, 0, scale.gameSize.width, scale.gameSize.height, 0, 0.8)
  //   .setDepth(9)
  //   .setOrigin(0, 0)
  //   .setScrollFactor(0);

  let amount = 0;

  setInterval(() => {
    amount += 1;
    token1.setText(amount.toString());
  }, 200);
};
