import {
  defineSceneConfig,
  AssetType,
  defineScaleConfig,
  defineMapConfig,
  defineCameraConfig,
} from "@latticexyz/phaserx";
import SummerTileset from "../../../public/assets/tilesets/summer.png";
import VictorySprite from "../../../public/assets/summ.png";
import CrystalsSpritesheet from "../../../public/assets/tilesets/crystals.png";
import PepeSpritesheet from "../../../public/assets/characters/pepe.png";
import { TileAnimations, Tileset } from "../../artTypes/world";
import {
  Sprites,
  Assets,
  Maps,
  Scenes,
  TILE_HEIGHT,
  TILE_WIDTH,
  Animations,
} from "./constants";

const ANIMATION_INTERVAL = 200;

const mainMap = defineMapConfig({
  chunkSize: TILE_WIDTH * 100, // tile size * tile amount
  tileWidth: TILE_WIDTH,
  tileHeight: TILE_HEIGHT,
  backgroundTile: [-1],
  animationInterval: ANIMATION_INTERVAL,
  tileAnimations: TileAnimations,
  layers: {
    layers: {
      Background: { tilesets: ["Summer"] },
      Foreground: { tilesets: ["Summer"] },
    },
    defaultLayer: "Background",
  },
});

export const phaserConfig = {
  sceneConfig: {
    [Scenes.Main]: defineSceneConfig({
      assets: {
        [Assets.SummerTileset]: {
          type: AssetType.Image,
          key: Assets.SummerTileset,
          path: SummerTileset,
        },
        [Assets.Crystals]: {
          type: AssetType.Image,
          key: Assets.Crystals,
          path: CrystalsSpritesheet,
        },
        [Assets.Pepe]: {
          type: AssetType.SpriteSheet,
          key: Assets.Pepe,
          path: PepeSpritesheet,
          options: {
            frameHeight: 32,
            frameWidth: 32,
          },
        },
        [Assets.Victory]: {
          type: AssetType.Image,
          key: Assets.Victory,
          path: VictorySprite,
          options: {
            frameHeight: 512,
            frameWidth: 528,
          },
        },
      },
      maps: {
        [Maps.Main]: mainMap,
      },
      sprites: {
        [Sprites.Pepe]: {
          assetKey: Assets.Pepe,
          startFrame: 0,
        },
        [Sprites.Crystal]: {
          assetKey: Assets.Crystals,
          startFrame: 0,
        },
        [Sprites.Victory]: {
          assetKey: Assets.Victory,
          startFrame: 0,
        },
      },
      animations: [
        {
          key: Animations.PepeIdle,
          assetKey: Assets.Pepe,
          startFrame: 0,
          endFrame: 3,
          frameRate: 3,
          repeat: -1,
        },
        {
          key: Animations.PepeRight,
          assetKey: Assets.Pepe,
          startFrame: 4,
          endFrame: 7,
          frameRate: 8,
          repeat: -1,
        },
        {
          key: Animations.PepeDown,
          assetKey: Assets.Pepe,
          startFrame: 8,
          endFrame: 11,
          frameRate: 8,
          repeat: -1,
        },
        {
          key: Animations.PepeLeft,
          assetKey: Assets.Pepe,
          startFrame: 12,
          endFrame: 15,
          frameRate: 8,
          repeat: -1,
        },
        {
          key: Animations.PepeUp,
          assetKey: Assets.Pepe,
          startFrame: 16,
          endFrame: 19,
          frameRate: 8,
          repeat: -1,
        },
      ],
      tilesets: {
        Summer: {
          assetKey: Assets.SummerTileset,
          tileWidth: TILE_WIDTH,
          tileHeight: TILE_HEIGHT,
        },
        Crystals: {
          assetKey: Assets.Crystals,
          tileWidth: 32,
          tileHeight: 32,
        },
      },
    }),
  },
  scale: defineScaleConfig({
    parent: "phaser-game",
    zoom: 3,
    mode: Phaser.Scale.CENTER_BOTH,
  }),
  cameraConfig: defineCameraConfig({
    pinchSpeed: 1,
    wheelSpeed: 1,
    maxZoom: 2,
    minZoom: 2,
  }),
  cullingChunkSize: TILE_HEIGHT * 16,
};
