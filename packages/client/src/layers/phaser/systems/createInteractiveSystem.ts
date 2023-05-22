import { pixelCoordToTileCoord } from "@latticexyz/phaserx";
import { TILE_HEIGHT, TILE_WIDTH } from "../constants";
import { PhaserLayer } from "../createPhaserLayer";
import {
  InteractiveEvent,
  getInteractiveTile,
} from "../utils/InteractriveObjectUtils";
import {
  Entity,
  EntitySymbol,
  Has,
  defineEnterSystem,
  getComponentValueStrict,
} from "@latticexyz/recs";
import { BigNumber } from "ethers";

export const createInteractiveSystem = (layer: PhaserLayer) => {
  const {
    superfluid,
    world,
    scenes: {
      Main: { input, objectPool, phaserScene },
    },
    networkLayer: {
      singletonEntity,
      wallet,
      network: {
        network: { signer },
      },
      systemCalls: { setSapphireStream },
      components: { Position, SFStoreTable },
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
      case InteractiveEvent.StartMining:
        return startMining();
      case InteractiveEvent.StartExchange:
        return startExchange();
    }
  }

  async function startExchange() {
    const storeData = getComponentValueStrict(SFStoreTable, "0x01" as Entity);
    const signerToUse = signer.get();
    if (!storeData || !signerToUse) return;

    const myAddress = await signerToUse.getAddress();
    if (!myAddress) return;

    console.log("Using signer", {
      signerToUse,
      myAddress,
      payload: {
        flowRate: storeData.maxFlowRate.toString(),
        receiver: storeData.storeAddress,
      },
    });

    // “Sapphire”, “SPHR”
    // “BluePotion”, “Blue”
    const superToken = await superfluid.framework.loadSuperToken("SPHR");
    console.log({ singletonEntity });

    const superTokenBalance = await superToken.balanceOf({
      account: myAddress,
      providerOrSigner: signerToUse,
    });

    console.log({ superTokenBalance });

    const transactionResult = await superToken
      .createFlow({
        flowRate: "1",
        receiver: storeData.storeAddress,
        overrides: {
          gasPrice: "0",
        },
      })
      .exec(signerToUse);

    console.log({ transactionResult });
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
