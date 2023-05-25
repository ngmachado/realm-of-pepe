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

import CaveSprite from "../../../public/assets/dialogs/cave.png";
import MineSprite from "../../../public/assets/dialogs/mine.png";
import MineActiveSprite from "../../../public/assets/dialogs/mineactive.png";
import StoreActiveSprite from "../../../public/assets/dialogs/storeactive.png";
import NftActiveSprite from "../../../public/assets/dialogs/nftactive.png";
import NFTSprite from "../../../public/assets/dialogs/nft.png";
import StoreSprite from "../../../public/assets/dialogs/store.png";
import StoreEnterSprite from "../../../public/assets/dialogs/storedialog.png";
import ForgeEnterSprite from "../../../public/assets/dialogs/forgedialog.png";
import BookSprite from "../../../public/assets/dialogs/book.png";
import IntroSprite from "../../../public/assets/dialogs/intro.png";
import InventoryBtnSprite from "../../../public/assets/buttons/inventory.png";
import SoldierSprite from "../../../public/assets/characters/soldier.png";
import StreamSprite from "../../../public/assets/animations/stream.png";
import PortalSprite from "../../../public/assets/animations/portal.png";

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
          type: AssetType.SpriteSheet,
          key: Assets.Crystals,
          path: CrystalsSpritesheet,
          options: {
            frameWidth: 32,
            frameHeight: 32,
          },
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
        [Assets.Cave]: {
          type: AssetType.Image,
          key: Assets.Cave,
          path: CaveSprite,
        },
        [Assets.Mine]: {
          type: AssetType.SpriteSheet,
          key: Assets.Mine,
          path: MineSprite,
          options: {
            frameWidth: 250,
            frameHeight: 176,
          },
        },
        [Assets.MineActive]: {
          type: AssetType.Image,
          key: Assets.MineActive,
          path: MineActiveSprite,
        },
        [Assets.StoreActive]: {
          type: AssetType.Image,
          key: Assets.StoreActive,
          path: StoreActiveSprite,
        },
        [Assets.NftActive]: {
          type: AssetType.Image,
          key: Assets.NftActive,
          path: NftActiveSprite,
        },
        [Assets.NFT]: {
          type: AssetType.SpriteSheet,
          key: Assets.NFT,
          path: NFTSprite,
          options: {
            frameWidth: 250,
            frameHeight: 176,
          },
        },
        [Assets.Store]: {
          type: AssetType.SpriteSheet,
          key: Assets.Store,
          path: StoreSprite,
          options: {
            frameWidth: 250,
            frameHeight: 200,
          },
        },
        [Assets.StoreEnter]: {
          type: AssetType.Image,
          key: Assets.StoreEnter,
          path: StoreEnterSprite,
        },
        [Assets.ForgeEnter]: {
          type: AssetType.Image,
          key: Assets.ForgeEnter,
          path: ForgeEnterSprite,
        },
        [Assets.Book]: {
          type: AssetType.Image,
          key: Assets.Book,
          path: BookSprite,
        },
        [Assets.Intro]: {
          type: AssetType.Image,
          key: Assets.Intro,
          path: IntroSprite,
        },
        [Assets.InventoryBtn]: {
          type: AssetType.Image,
          key: Assets.InventoryBtn,
          path: InventoryBtnSprite,
        },
        [Assets.Soldier]: {
          type: AssetType.SpriteSheet,
          key: Assets.Soldier,
          path: SoldierSprite,
          options: {
            frameHeight: 32,
            frameWidth: 16,
            scale: 3,
          },
        },
        [Assets.Stream]: {
          type: AssetType.SpriteSheet,
          key: Assets.Stream,
          path: StreamSprite,
          options: {
            frameHeight: 64,
            frameWidth: 64,
          },
        },
        [Assets.Portal]: {
          type: AssetType.SpriteSheet,
          key: Assets.Portal,
          path: PortalSprite,
          options: {
            frameWidth: 46,
            frameHeight: 48,
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
        [Sprites.Soldier]: {
          assetKey: Assets.Soldier,
          startFrame: 0,
        },
        [Sprites.Stream]: {
          assetKey: Assets.Stream,
          startFrame: 0,
        },

        [Sprites.Mine]: {
          assetKey: Assets.Mine,
          startFrame: 0,
        },
        [Sprites.Store]: {
          assetKey: Assets.Store,
          startFrame: 0,
        },
        [Sprites.NFT]: {
          assetKey: Assets.NFT,
          startFrame: 0,
        },
        [Sprites.Portal]: {
          assetKey: Assets.Portal,
          startFrame: 0,
        },
      },
      animations: [
        {
          key: Animations.PepeIdle,
          assetKey: Assets.Pepe,
          startFrame: 0,
          endFrame: 0,
          frameRate: 8,
          repeat: -1,
        },
        {
          key: Animations.PepeRight,
          assetKey: Assets.Pepe,
          startFrame: 4,
          endFrame: 6,
          frameRate: 8,
          repeat: 0,
        },
        {
          key: Animations.PepeDown,
          assetKey: Assets.Pepe,
          startFrame: 8,
          endFrame: 10,
          frameRate: 8,
          repeat: 0,
        },
        {
          key: Animations.PepeLeft,
          assetKey: Assets.Pepe,
          startFrame: 12,
          endFrame: 14,
          frameRate: 8,
          repeat: 0,
        },
        {
          key: Animations.PepeUp,
          assetKey: Assets.Pepe,
          startFrame: 16,
          endFrame: 18,
          frameRate: 8,
          repeat: 0,
        },
        {
          key: Animations.StreamFlow,
          assetKey: Assets.Stream,
          startFrame: 0,
          endFrame: 29,
          frameRate: 8,
          repeat: -1,
        },

        {
          key: Animations.MineLoading,
          assetKey: Assets.Mine,
          startFrame: 1,
          endFrame: 5,
          frameRate: 3,
          repeat: -1,
        },

        {
          key: Animations.StoreLoading,
          assetKey: Assets.Store,
          startFrame: 1,
          endFrame: 5,
          frameRate: 3,
          repeat: -1,
        },
        {
          key: Animations.NFTLoading,
          assetKey: Assets.NFT,
          startFrame: 1,
          endFrame: 5,
          frameRate: 3,
          repeat: -1,
        },
        {
          key: Animations.Portal,
          assetKey: Assets.Portal,
          startFrame: 0,
          endFrame: 4,
          frameRate: 3,
          repeat: -1,
        },
      ],
      tilesets: {
        Summer: {
          assetKey: Assets.SummerTileset,
          tileWidth: TILE_WIDTH,
          tileHeight: TILE_HEIGHT,
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
