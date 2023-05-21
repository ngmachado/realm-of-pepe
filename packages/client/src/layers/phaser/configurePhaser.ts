import {
  defineSceneConfig,
  AssetType,
  defineScaleConfig,
  defineMapConfig,
  defineCameraConfig,
} from "@latticexyz/phaserx";
import worldTileset from "../../../public/assets/tilesets/world.png";
import newTileset from "../../../public/assets/tilesets/new_world.png";
import MageSpritesheet from "../../../public/assets/characters/mage.png";
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
  backgroundTile: [Tileset.Grass],
  animationInterval: ANIMATION_INTERVAL,
  tileAnimations: TileAnimations,
  layers: {
    layers: {
      Background: { tilesets: ["Default"] },
      Foreground: { tilesets: ["Default"] },
    },
    defaultLayer: "Background",
  },
});

export const phaserConfig = {
  sceneConfig: {
    [Scenes.Main]: defineSceneConfig({
      assets: {
        [Assets.Tileset]: {
          type: AssetType.Image,
          key: Assets.Tileset,
          path: worldTileset,
        },
        [Assets.NewTiles]: {
          type: AssetType.Image,
          key: Assets.NewTiles,
          path: newTileset,
        },
        [Assets.MainAtlas]: {
          type: AssetType.MultiAtlas,
          key: Assets.MainAtlas,
          // Add a timestamp to the end of the path to prevent caching
          path: `/assets/atlases/atlas.json?timestamp=${Date.now()}`,
          options: {
            imagePath: "/assets/atlases/",
          },
        },
        [Assets.Mage]: {
          type: AssetType.SpriteSheet,
          key: Assets.Mage,
          path: MageSpritesheet,
          options: {
            frameHeight: 48,
            frameWidth: 32,
          },
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
      },
      maps: {
        [Maps.Main]: mainMap,
      },
      sprites: {
        [Sprites.Soldier]: {
          assetKey: Assets.MainAtlas,
          frame: "sprites/soldier/idle/0.png",
        },
        [Sprites.Mage]: {
          assetKey: Assets.Mage,
          startFrame: 0,
        },
        [Sprites.Pepe]: {
          assetKey: Assets.Pepe,
          startFrame: 0,
        },
      },
      animations: [
        {
          key: Animations.SwordsmanIdle,
          assetKey: Assets.MainAtlas,
          startFrame: 0,
          endFrame: 3,
          frameRate: 6,
          repeat: -1,
          prefix: "sprites/soldier/idle/",
          suffix: ".png",
        },
        {
          key: Animations.MageIdle,
          assetKey: Assets.Mage,
          startFrame: 0,
          endFrame: 5,
          frameRate: 6,
          repeat: -1,
        },
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
        Default: {
          assetKey: Assets.NewTiles,
          // assetKey: Assets.Tileset,
          tileWidth: TILE_WIDTH,
          tileHeight: TILE_HEIGHT,
        },
      },
    }),
  },
  scale: defineScaleConfig({
    parent: "phaser-game",
    zoom: 2,
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
