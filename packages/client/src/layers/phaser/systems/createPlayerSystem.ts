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
import { getMovementAction } from "../utils/InputUtils";
import { SUMMER_COLLISION_MAP, isCollision } from "../utils/CollisionUtils";

export const createPlayerSystem = (layer: PhaserLayer) => {
  let cachedPlayerTilePosition = { x: 0, y: 0 };
  let spawned = false;

  const {
    world,
    networkLayer: {
      components: { Position },
      systemCalls: { spawn, move },
      playerEntity,
    },
    scenes: {
      Main: {
        camera,
        objectPool,
        input,
        phaserScene: { tweens },
      },
    },
  } = layer;

  // TODO: Use this for interactive items when phaserX tiles are interactive
  // phaserInput.on("gameobjectdown", (pointer: any, gameObject: any) => {
  //   console.log("Game obj down", { pointer, gameObject });
  // });

  input.pointerdown$.subscribe(() => {
    // if (!event.pointer) return;
    // const x = event.pointer.worldX;
    // const y = event.pointer.worldY;

    // const position = pixelCoordToTileCoord({ x, y }, TILE_WIDTH, TILE_HEIGHT);

    // if (position.x === 0 && position.y === 0) return;
    spawn(15, 15);
  });

  input.keyboard$.subscribe((e) => {
    if (e && playerEntity && spawned) {
      const action = getMovementAction(e.keyCode);

      if (action) {
        const tempCachedPlayerTilePosition = cachedPlayerTilePosition;

        cachedPlayerTilePosition = {
          x: cachedPlayerTilePosition.x + action.x,
          y: cachedPlayerTilePosition.y + action.y,
        };

        // if cachedPlayerTilePosition is not set get it from the playerEntity
        if (
          cachedPlayerTilePosition.x === 0 &&
          cachedPlayerTilePosition.y === 0
        ) {
          cachedPlayerTilePosition = getComponentValueStrict(
            Position,
            playerEntity
          );
        }

        // bool representing if the player is trying to move into a collision tile
        const hit = isCollision(
          cachedPlayerTilePosition.x,
          cachedPlayerTilePosition.y
        );

        const pixelPosition = tileCoordToPixelCoord(
          cachedPlayerTilePosition,
          TILE_WIDTH,
          TILE_HEIGHT
        );

        const playerObj = objectPool.get(playerEntity, "Sprite");

        console.log(action);
        if (!hit) {
          // use then to wait for the animation to finish
          playerObj.setComponent({
            id: "animation",
            once: (sprite) => {
              sprite.setPosition(pixelPosition.x, pixelPosition.y);
              sprite.play(action.animation);
            },
          });
          camera.phaserCamera.pan(pixelPosition.x, pixelPosition.y, 200);

          console.log("move");
          console.log("cachedPlayerTilePosition", cachedPlayerTilePosition);
          move(cachedPlayerTilePosition.x, cachedPlayerTilePosition.y);
        } else {
          console.log("hit", hit);
          playerObj.setComponent({
            id: "animation",
            once: (sprite) => {
              sprite.play(action.animation);
            },
          });
          cachedPlayerTilePosition = tempCachedPlayerTilePosition;
        }
      }

      // playerObj.setComponent({
      //   id: "position",
      //   update: (sprite) => {
      //     sprite.setPosition(pixelPosition.x, pixelPosition.y);
      //   }
      // });
    }
  });

  console.log("OBJECT POOL", { objectPool });

  defineEnterSystem(world, [Has(Position)], ({ entity }) => {
    const playerSprite = objectPool.get(entity, "Sprite");

    if (playerEntity === entity) {
      const position = getComponentValueStrict(Position, entity);
      cachedPlayerTilePosition.x = position.x;
      cachedPlayerTilePosition.y = position.y;
      spawned = true;
    }

    playerSprite.setComponent({
      id: "animation",
      once: (sprite) => {
        sprite.play(Animations.PepeIdle);
      },
    });
  });

  defineSystem(world, [Has(Position)], ({ entity }) => {
    if (playerEntity === entity) {
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
