import { pixelCoordToTileCoord } from "@latticexyz/phaserx";
import { TILE_HEIGHT, TILE_WIDTH } from "../constants";
import { PhaserLayer } from "../createPhaserLayer";
import {
  InteractiveEvent,
  getInteractiveTile,
} from "../utils/InteractriveObjectUtils";
import { Has, defineEnterSystem } from "@latticexyz/recs";

export const createInteractiveSystem = (layer: PhaserLayer) => {
  const {
    superfluid,
    world,
    scenes: {
      Main: { input, objectPool, phaserScene },
    },
    networkLayer: {
      systemCalls: { setSapphireStream },
      components: { Position },
      playerEntity,
    },
  } = layer;

  input.pointerdown$.subscribe((event, ...rest) => {
    console.log({ ...event, rest });

    const x = event.pointer.worldX;
    const y = event.pointer.worldY;

    const position = pixelCoordToTileCoord({ x, y }, TILE_WIDTH, TILE_HEIGHT);
    console.log("Clicked on tile", position.x, position.y);

    const eventTile = getInteractiveTile(position.x, position.y);
    if (eventTile) handleInteractiveEvent(eventTile.event);
  });

  function handleInteractiveEvent(event: InteractiveEvent) {
    switch (event) {
      case InteractiveEvent.OpenPortal:
        return openPortal();
      case InteractiveEvent.StartMining:
        return startMining();
    }
  }

  function openPortal() {
    console.log("Event triggered");
  }

  function startMining() {
    setSapphireStream();
    // console.log({ superfluid });
  }

  defineEnterSystem(world, [Has(Position)], ({ entity }) => {
    if (playerEntity === entity) {
      const playerSprite = objectPool.get(entity, "Sprite");
      const userSprite = phaserScene.children.getByName(
        `player-${playerSprite.id}`
      );
      console.log("Found user sprite, adding callback");
      if (userSprite) {
        console.log("Adding callback");
        userSprite.on(
          "changedata",
          (...args: any) => {
            console.log("HANDLING CALLBACK", args);
          },
          phaserScene
        );
      }
    }
  });
};
