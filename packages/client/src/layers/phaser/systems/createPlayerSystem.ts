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

function getMovementAction(keyCode: number) {
  switch (keyCode) {
    case 37: // LEFT
      return {
        animation: Animations.PepeLeft,
        x: -1,
        y: 0,
      };
    case 38: // UP
      return {
        animation: Animations.PepeUp,
        x: 0,
        y: -1,
      };
    case 39: // RIGHT
      return {
        animation: Animations.PepeRight,
        x: 1,
        y: 0,
      };
    case 40: // DOWN
      return {
        animation: Animations.PepeDown,
        x: 0,
        y: 1,
      };
  }
}

export const createPlayerSystem = (layer: PhaserLayer) => {
  const {
    world,
    networkLayer: {
      components: { Position },
      systemCalls: { spawn, move },
      playerEntity,
    },
    scenes: {
      Main: {
        objectPool,
        input,
        phaserScene: { tweens },
      },
    },
  } = layer;

  input.pointerdown$.subscribe((event) => {
    console.log({ ...event });
    if (!event.pointer) return;

    const x = event.pointer.worldX;
    const y = event.pointer.worldY;

    const position = pixelCoordToTileCoord({ x, y }, TILE_WIDTH, TILE_HEIGHT);
    if (position.x === 0 && position.y === 0) return;
    spawn(position.x, position.y);
  });

  input.keyboard$.subscribe((e) => {
    if (e && playerEntity) {
      const action = getMovementAction(e.keyCode);

      if (action) {
        const position = getComponentValueStrict(Position, playerEntity);

        const newPosition = {
          x: position.x + action.x,
          y: position.y + action.y,
        };

        const pixelPosition = tileCoordToPixelCoord(
          newPosition,
          TILE_WIDTH,
          TILE_HEIGHT
        );

        const playerObj = objectPool.get(playerEntity, "Sprite");

        console.log(action);

        move(newPosition.x, newPosition.y);

        playerObj.setComponent({
          id: "animation",
          once: (sprite) => {
            sprite.setPosition(pixelPosition.x, pixelPosition.y);
            sprite.play(action.animation);
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
