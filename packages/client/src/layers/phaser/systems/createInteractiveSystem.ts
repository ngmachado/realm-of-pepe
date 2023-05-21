import { pixelCoordToTileCoord } from "@latticexyz/phaserx";
import { TILE_HEIGHT, TILE_WIDTH } from "../constants";
import { PhaserLayer } from "../createPhaserLayer";
import {
  InteractiveEvent,
  getInteractiveTile,
} from "../utils/InteractriveObjectUtils";

export const createInteractiveSystem = (layer: PhaserLayer) => {
  const {
    scenes: {
      Main: { input },
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
        openPortal();
    }
  }

  function openPortal() {
    console.log("Event triggered");
  }
};
