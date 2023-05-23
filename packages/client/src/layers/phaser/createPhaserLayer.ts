import { createPhaserEngine } from "@latticexyz/phaserx";
import { namespaceWorld } from "@latticexyz/recs";
import { NetworkLayer } from "../network/createNetworkLayer";
import { registerSystems } from "./systems";
import {
  SuperfluidLayer,
  createSuperfluidLayer,
} from "../network/createSuperfluidLayer";
import { WORLD_HEIGHT, WORLD_WIDTH } from "./constants";
import { Subject } from "rxjs";

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

  camera.phaserCamera.setBounds(0, 0, WORLD_HEIGHT * 3, WORLD_WIDTH * 3);
  camera.phaserCamera.centerOn(15, 15);

  const loaderPlugin = scenes.Main.phaserScene.load.audio(
    "song",
    "assets/soundtrack/realmofpepe_loqual2.m4a"
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

  const superfluid = await createSuperfluidLayer(networkLayer);

  const playerLocation = new Subject<{ x: number; y: number }>();

  const components = {};

  const layer = {
    playerLocation,
    networkLayer,
    world,
    game,
    scenes,
    components,
    superfluid,
  };

  registerSystems(layer);

  return layer;
};
