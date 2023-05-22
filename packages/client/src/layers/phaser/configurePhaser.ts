import {
  AssetType,
  defineCameraConfig,
  defineMapConfig,
  defineScaleConfig,
  defineSceneConfig,
} from "@latticexyz/phaserx";
import BgSprite from "../../../public/assets/bg.png";
import PepeSpritesheet from "../../../public/assets/characters/pepe.png";
import CrystalsSpritesheet from "../../../public/assets/tilesets/crystals.png";
import SummerTileset from "../../../public/assets/tilesets/summer.png";
import { TileAnimations } from "../../artTypes/world";
import {
  Animations,
  Assets,
  Maps,
  Scenes,
  Sprites,
  TILE_HEIGHT,
  TILE_WIDTH,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from "./constants";

const ANIMATION_INTERVAL = 200;

const mainMap = defineMapConfig({
  chunkSize: TILE_WIDTH * 1000, // tile size * tile amount
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
            scale: 3,
          },
        },
        [Assets.Background]: {
          type: AssetType.Image,
          key: Assets.Background,
          path: BgSprite,
          options: {
            frameHeight: WORLD_HEIGHT,
            frameWidth: WORLD_WIDTH,
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
        [Sprites.Background]: {
          assetKey: Assets.Background,
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
    zoom: 1,
    mode: Phaser.Scale.CENTER_BOTH,
  }),
  cameraConfig: defineCameraConfig({
    pinchSpeed: 1,
    wheelSpeed: 1,
    maxZoom: 2,
    minZoom: 2,
  }),
  cullingChunkSize: TILE_HEIGHT * 32,
};
