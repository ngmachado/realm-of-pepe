import {
  Has,
  defineEnterSystem,
  defineSystem,
  getComponentValueStrict,
} from "@latticexyz/recs";
import { PhaserLayer } from "../createPhaserLayer";
import { Animations, TILE_HEIGHT, TILE_WIDTH } from "../constants";
import {
  pixelCoordToTileCoord,
  tileCoordToPixelCoord,
} from "@latticexyz/phaserx";

function getMovementAnimation(keyCode: number) {
  switch (keyCode) {
    case 37:
      return Animations.PepeLeft;
      // KEYS_PRESSED.left === e.isDown;
      break;
    case 38:
      // KEYS_PRESSED.up === e.isDown;
      return Animations.PepeUp;
      break;
    case 39:
      // KEYS_PRESSED.right === e.isDown;
      return Animations.PepeRight;
      break;
    case 40:
      return Animations.PepeDown;
      // KEYS_PRESSED.down === e.isDown;
      break;
  }
}

export const createPlayerSystem = (layer: PhaserLayer) => {
  const {
    world,
    networkLayer: {
      components: { Position },
      systemCalls: { spawn },
      playerEntity,
    },
    scenes: {
      Main: { objectPool, input },
    },
  } = layer;

  input.pointerdown$.subscribe((event) => {
    if (!event.pointer) return;

    const x = event.pointer.worldX;
    const y = event.pointer.worldY;

    const position = pixelCoordToTileCoord({ x, y }, TILE_WIDTH, TILE_HEIGHT);
    if (position.x === 0 && position.y === 0) return;
    spawn(position.x, position.y);
  });

  // const KEYS_PRESSED = {
  //   left: false,
  //   up: false,
  //   right: false,
  //   down: false,
  // };

  input.keyboard$.subscribe((e) => {
    // switch (e.keyCode) {
    //   case 37:
    //     KEYS_PRESSED.left === e.isDown;
    //     break;
    //   case 38:
    //     KEYS_PRESSED.up === e.isDown;
    //     break;
    //   case 39:
    //     KEYS_PRESSED.right === e.isDown;
    //     break;
    //   case 40:
    //     KEYS_PRESSED.down === e.isDown;
    //     break;
    // }

    console.log({ playerEntity });
    if (playerEntity) {
      const position = getComponentValueStrict(Position, playerEntity);
      const pixelPosition = tileCoordToPixelCoord(
        position,
        TILE_WIDTH,
        TILE_HEIGHT
      );

      const playerObj = objectPool.get(playerEntity, "Sprite");

      const animation = getMovementAnimation(e.keyCode);
      console.log(animation);
      if (animation) {
        playerObj.setComponent({
          id: "animation",
          once: (sprite) => {
            sprite.play(animation);
          },
        });
      }

      // playerObj.setComponent({
      //   id: "position",
      //   update: (sprite) => {
      //     sprite.setPosition(pixelPosition.x, pixelPosition.y);
      //   }
      // });
    }
  });

  defineEnterSystem(world, [Has(Position)], ({ entity }) => {
    const playerSprite = objectPool.get(entity, "Sprite");

    playerSprite.setComponent({
      id: "animation",
      once: (sprite) => {
        sprite.play(Animations.PepeIdle);
      },
    });
  });

  defineSystem(world, [Has(Position)], ({ entity }) => {
    if (playerEntity === entity) {
      console.log("Its me, do nothing");
      return;
    }

    const position = getComponentValueStrict(Position, entity);
    const pixelPosition = tileCoordToPixelCoord(
      position,
      TILE_WIDTH,
      TILE_HEIGHT
    );

    const playerSprite = objectPool.get(entity, "Sprite");

    playerSprite.setComponent({
      id: "position",
      once: (sprite) => {
        sprite.setPosition(pixelPosition.x, pixelPosition.y);
      },
    });
  });
};
