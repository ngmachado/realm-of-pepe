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
  let firstRun = true;

  const {
    playerLocation,
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
    spawn(15, 15);
  });

  input.keyboard$.subscribe((e) => {
    // don't do anything if the key is released
    if (e.isUp) return;
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

        if (!hit) {
          // use then to wait for the animation to finish
          playerObj.setComponent({
            id: "animation",
            once: (sprite) => {
              sprite.setPosition(pixelPosition.x, pixelPosition.y);
              playerLocation.next({
                x: cachedPlayerTilePosition.x,
                y: cachedPlayerTilePosition.y,
              });
              sprite.play(action.animation);
              // sprite.setScale(3);
            },
          });
          camera.phaserCamera.pan(pixelPosition.x, pixelPosition.y, 200);

          move(cachedPlayerTilePosition.x, cachedPlayerTilePosition.y);
        } else {
          playerObj.setComponent({
            id: "animation",
            once: (sprite) => {
              sprite.play(action.animation);
              // sprite.setScale(3);
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

  defineEnterSystem(world, [Has(Position)], ({ entity }) => {
    const playerSprite = objectPool.get(entity, "Sprite");

    if (playerEntity === entity) {
      const position = getComponentValueStrict(Position, entity);
      cachedPlayerTilePosition.x = position.x;
      cachedPlayerTilePosition.y = position.y;
      playerLocation.next({ x: position.x, y: position.y });

      spawned = true;
    }

    playerSprite.setComponent({
      id: "animation",
      once: (sprite) => {
        sprite.play(Animations.PepeIdle);
        sprite.setPosition(
          cachedPlayerTilePosition.x,
          cachedPlayerTilePosition.y
        );
        sprite.setScale(3);
        sprite.setName(`player-${entity}`);
      },
    });
  });

  defineSystem(world, [Has(Position)], ({ entity }) => {
    const isPlayer = playerEntity === entity;
    if (isPlayer && !firstRun) {
      return;
    }
    firstRun = false;
    const position = getComponentValueStrict(Position, entity);
    const pixelPosition = tileCoordToPixelCoord(
      position,
      TILE_WIDTH,
      TILE_HEIGHT
    );

    if(isPlayer) {
        camera.phaserCamera.pan(pixelPosition.x, pixelPosition.y, 0);
    }
    const playerSprite = objectPool.get(entity, "Sprite");
    playerSprite.setComponent({
      id: "position",
      once: (sprite) => {
        sprite.setPosition(pixelPosition.x, pixelPosition.y);
      },
    });
  });
};
