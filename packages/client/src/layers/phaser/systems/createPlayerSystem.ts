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

export const createPlayerSystem = (layer: PhaserLayer) => {

  let cachedPlayerTilePosition = { x: 0, y: 0 };

  // The collision layer data
  const collisionLayerData = [
    {x: 12, y: 0, width: 4, height: 8},
    {x: 10, y: 11, width: 2, height: 2},
  ];


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

  // TODO: Use this for interactive items when phaserX tiles are interactive
  // phaserInput.on("gameobjectdown", (pointer: any, gameObject: any) => {
  //   console.log("Game obj down", { pointer, gameObject });
  // });

  input.pointerdown$.subscribe((event) => {
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
      const playerHeight = 1;
      const playerWidth = 1;

      if (action) {
        
        const tempCachedPlayerTilePosition = cachedPlayerTilePosition;
        
        cachedPlayerTilePosition = {
          x: cachedPlayerTilePosition.x + action.x,
          y: cachedPlayerTilePosition.y + action.y,
        }
        // if cachedPlayerTilePosition is not set get it from the playerEntity
        if(cachedPlayerTilePosition.x === 0 && cachedPlayerTilePosition.y === 0) {
            cachedPlayerTilePosition = getComponentValueStrict(Position, playerEntity);
        }

        // bool representing if the player is trying to move into a collision tile
        const hit = collisionLayerData.find(data =>
            cachedPlayerTilePosition.x < data.x + data.width &&
            cachedPlayerTilePosition.x + playerWidth > data.x &&
            cachedPlayerTilePosition.y < data.y + data.height &&
            cachedPlayerTilePosition.y + playerHeight > data.y
        ) !== undefined;


        const pixelPosition = tileCoordToPixelCoord(
            cachedPlayerTilePosition,
          TILE_WIDTH,
          TILE_HEIGHT
        );

        const playerObj = objectPool.get(playerEntity, "Sprite");

        console.log(action);
        if(!hit) {
          // use then to wait for the animation to finish
          playerObj.setComponent({
            id: "animation",
            once: (sprite) => {
              sprite.setPosition(pixelPosition.x, pixelPosition.y);
              sprite.play(action.animation);
            },
          });

          console.log("move")
          console.log("cachedPlayerTilePosition", cachedPlayerTilePosition)
          move(cachedPlayerTilePosition.x, cachedPlayerTilePosition.y);
        } else {
          console.log("hit", hit)
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
