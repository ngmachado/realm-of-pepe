import { PhaserLayer } from "../createPhaserLayer";

export const createCamera = (layer: PhaserLayer) => {
  const {
    scenes: {
      Main: {
        camera: { phaserCamera },
      },
    },
  } = layer;

  phaserCamera.centerOn(10, 10);
  // layer.scenes.Main.input.drag$.subscribe((e: any) => {
  //   if (e) {
  //     phaserCamera.pan(
  //       phaserCamera.scrollX + e.width,
  //       phaserCamera.scrollY + e.height
  //     );
  //     // phaserCamera.scrollX = (e.x + e.width) / phaserCamera.zoom;
  //     // phaserCamera.scrollY = (e.y + e.height) / phaserCamera.zoom;
  //   }
  // });
};
