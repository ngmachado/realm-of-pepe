import { PhaserLayer } from "../createPhaserLayer";
import { createCamera } from "./createCamera";
import { createInteractiveSystem } from "./createInteractiveSystem";
import { createMapSystem } from "./createMapSystem";
import { createPlayerSystem } from "./createPlayerSystem";
import { createUISystem } from "./createUISystem";

export const registerSystems = (layer: PhaserLayer) => {
  createCamera(layer);
  createMapSystem(layer);
  createPlayerSystem(layer);
  createInteractiveSystem(layer);
  createUISystem(layer);
};
