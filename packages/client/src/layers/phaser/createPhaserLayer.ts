import { createPhaserEngine } from "@latticexyz/phaserx";
import { namespaceWorld } from "@latticexyz/recs";
import { NetworkLayer } from "../network/createNetworkLayer";
import { registerSystems } from "./systems";

export type PhaserLayer = Awaited<ReturnType<typeof createPhaserLayer>>;
type PhaserEngineConfig = Parameters<typeof createPhaserEngine>[0];

export const createPhaserLayer = async (
  networkLayer: NetworkLayer,
  phaserConfig: PhaserEngineConfig
) => {
  const world = namespaceWorld(networkLayer.world, "phaser");

  const {
    game,
    scenes,
    dispose: disposePhaser,
  } = await createPhaserEngine(phaserConfig);
  world.registerDisposer(disposePhaser);

  const { camera } = scenes.Main;

  camera.phaserCamera.setBounds(0, 0, 528, 520);
  camera.phaserCamera.centerOn(15, 15);

  const loaderPlugin = scenes.Main.phaserScene.load.audio(
    "song",
    "assets/soundtrack/realmofpepe.mp3"
  );
  loaderPlugin.start();

  loaderPlugin.on("complete", () => {
    scenes.Main.phaserScene.sound.add("song", {
      loop: true,
    });
    scenes.Main.phaserScene.sound.play("song", {
      loop: true,
    });
  });

  const components = {};

  const layer = {
    networkLayer,
    world,
    game,
    scenes,
    components,
  };

  registerSystems(layer);

  return layer;
};
