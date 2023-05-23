import {
  pixelCoordToTileCoord,
  tileCoordToPixelCoord,
} from "@latticexyz/phaserx";
import {
  Entity,
  Has,
  defineEnterSystem,
  getComponentValueStrict,
} from "@latticexyz/recs";
import { Assets, TILE_HEIGHT, TILE_WIDTH } from "../constants";
import { PhaserLayer } from "../createPhaserLayer";
import {
  InteractiveEvent,
  getInteractiveTile,
  getTilesToInteractWith,
} from "../utils/InteractriveObjectUtils";
import { waitForTransaction } from "@wagmi/core";
import { Address } from "viem";

export const createInteractiveSystem = (layer: PhaserLayer) => {
  const {
    playerLocation,
    superfluid,
    world,
    scenes: {
      Main: { objectPool, phaserScene },
    },
    networkLayer: {
      playerEntityId,
      network: {
        network: { signer },
      },
      systemCalls: { setSapphireStream },
      components: { Position, SFStoreTable, SFSuperTokenTable },
      playerEntity,
    },
  } = layer;

  const storeDialog = addDialog("store", Assets.Store, 24, 8, startExchange);
  const mineDialog = addDialog("mine", Assets.Mine, 26, 30, startMining);
  const nftDialog = addDialog("nft", Assets.NFT, 44, 13, mintNFT);

  playerLocation.subscribe((newLocation) => {
    console.log("Interact?", newLocation.x, newLocation.y);

    const action = getInteractiveTile(newLocation.x, newLocation.y);

    switch (action?.event) {
      case InteractiveEvent.StartMining:
        mineDialog.setVisible(true);
        break;
      case InteractiveEvent.StartExchange:
        storeDialog.setVisible(true);
        break;
      case InteractiveEvent.MintNFT:
        nftDialog.setVisible(true);
        break;
      default:
        mineDialog.setVisible(false);
        storeDialog.setVisible(false);
        nftDialog.setVisible(false);
    }
  });

  function addDialog(
    name: string,
    image: string,
    x: number,
    y: number,
    onClick: () => void
  ) {
    const pixelCoordinates = tileCoordToPixelCoord(
      { x, y },
      TILE_WIDTH,
      TILE_HEIGHT
    );
    return phaserScene.add
      .image(pixelCoordinates.x, pixelCoordinates.y, image)
      .setName(name)
      .setOrigin(0, 0)
      .setDepth(17)
      .setInteractive()
      .setVisible(false)
      .on("pointerdown", onClick);
  }

  async function mintNFT() {
    const nftBuilding = getComponentValueStrict(
      SFSuperTokenTable,
      "0x03" as Entity
    );

    const signerToUse = signer.get();
    if (!nftBuilding || !signerToUse) return;

    const myAddress = await signerToUse.getAddress();
    if (!myAddress) return;

    const superToken = await superfluid.framework.loadSuperToken("SPHR");

    const transactionResult = await superToken
      .createFlow({
        flowRate: "500000000",
        receiver: nftBuilding.superTokenAddress,
        overrides: {
          gasPrice: "0",
        },
      })
      .exec(signerToUse);

    console.log("Waiting for transaction");
    await waitForTransaction({
      hash: transactionResult.hash as Address,
    });
    console.log("Transaction went through");
    // This can be async
    superfluid.streamStore.loadRealTimeBalance("SPHR");

    phaserScene.add
      .sprite(46, 21, Assets.Crystals, 5)
      .setOrigin(0, 0)
      .setDepth(1);
  }

  async function startExchange() {
    const storeData = getComponentValueStrict(SFStoreTable, "0x01" as Entity);
    const signerToUse = signer.get();
    if (!storeData || !signerToUse || !playerEntityId) return;

    const superToken = await superfluid.framework.loadSuperToken("SPHR");

    const transactionResult = await superToken
      .createFlow({
        flowRate: "5000000000000",
        receiver: storeData.storeAddress,
        overrides: {
          gasPrice: "0",
        },
      })
      .exec(signerToUse);

    console.log("Waiting for transaction");
    await waitForTransaction({
      hash: transactionResult.hash as Address,
    });
    console.log("Transaction went through");
    // Updating real time balances for the tokens
    superfluid.streamStore.loadRealTimeBalance("SPHR");
    superfluid.streamStore.loadRealTimeBalance("Blue");
  }

  async function startMining() {
    await setSapphireStream();
    // TODO: This is a hacky way, how to get callback?
    console.log("Fetching SPHR");
    setTimeout(() => {
      superfluid.streamStore.loadRealTimeBalance("SPHR");
    }, 2000);
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
