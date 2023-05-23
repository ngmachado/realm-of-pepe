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
      Main: { objectPool, phaserScene, camera },
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

  const inventoryButton = phaserScene.add
    .image(phaserScene.cameras.main.width - 178, 0, Assets.InventoryBtn)
    .setOrigin(0, 0)
    .setDepth(18)
    .setScrollFactor(0)
    .setInteractive()
    .on("pointerdown", () => {
      toggleInventory();
    });

  const backdrop = phaserScene.add
    .rectangle(
      0,
      0,
      phaserScene.cameras.main.width,
      phaserScene.cameras.main.height,
      0,
      0.5
    )
    .setScrollFactor(0)
    .setDepth(19)
    .setOrigin(0, 0);

  const introDialog = addDialog(Assets.Intro, () => {
    introDialog.setVisible(false);
    backdrop.setVisible(false);
  })
    .setVisible(true)
    .setScrollFactor(0);

  const bookDialog = addDialog(Assets.Book, () => {
    toggleInventory();
  }).setScrollFactor(0);

  const storeDialog = addTooltip(Assets.Store, 24, 8, startExchange);
  const mineDialog = addTooltip(Assets.Mine, 26, 30, startMining);
  const nftDialog = addTooltip(Assets.NFT, 44, 13, mintNFT);
  const caveDialog = addTooltip(Assets.Cave, 3, 13, enterCave);

  playerLocation.subscribe((newLocation) => {
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
      case InteractiveEvent.EnterCave:
        caveDialog.setVisible(true);
        break;
      default:
        mineDialog.setVisible(false);
        storeDialog.setVisible(false);
        nftDialog.setVisible(false);
        caveDialog.setVisible(false);
    }
  });

  let showInventory = false;

  function toggleInventory() {
    showInventory = !showInventory;
    console.log("TOGGLE INV");

    if (showInventory) {
      backdrop.setVisible(true);
      bookDialog.setVisible(true);
    } else {
      backdrop.setVisible(false);
      bookDialog.setVisible(false);
    }
  }
  function addTooltip(
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
      .setOrigin(0, 0)
      .setDepth(15)
      .setInteractive()
      .setVisible(false)
      .on("pointerdown", onClick);
  }

  function addDialog(image: string, onClick: () => void) {
    return phaserScene.add
      .image(
        phaserScene.cameras.main.width / 2,
        phaserScene.cameras.main.height / 2,
        image
      )
      .setDepth(20)
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

    const superToken = await superfluid.framework.loadSuperToken("Blue");

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

  async function enterCave() {
    console.log("WHOOOOOO YOUR ARE AMAZING!!!");
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
