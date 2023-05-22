import { PhaserLayer } from "../createPhaserLayer";

export const createUISystem = (layer: PhaserLayer) => {
  const {
    superfluid,
    scenes: {
      Main: { phaserScene },
    },
  } = layer;

  const test = phaserScene.add
    .text(10, 10, "THIS IS A TEST", {
      color: "#ffffff",
      fontSize: "24px",
      fontFamily: "VT323",
    })
    .setOrigin(0, 0)
    .setDepth(10)
    .setScrollFactor(0);

  console.log({ test });
};
