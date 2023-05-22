import { world } from "../../mud/world";
import { setup } from "../../mud/setup";
import { getBurnerWallet } from "@latticexyz/std-client";
import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";
import { configureChains } from "@wagmi/core";
import { foundry } from "@wagmi/chains";
import { jsonRpcProvider } from "@wagmi/core/providers/jsonRpc";
import {
  Entity,
  EntitySymbol,
  getComponentValue,
  getComponentValueStrict,
} from "@latticexyz/recs";

export type NetworkLayer = Awaited<ReturnType<typeof createNetworkLayer>>;

export const createNetworkLayer = async () => {
  const { components, network, systemCalls } = await setup();
  const { singletonEntity, playerEntityId, playerEntity } = network;

  // Give components a Human-readable ID
  Object.entries(components).forEach(([name, component]) => {
    component.id = name;
  });

  return {
    world,
    singletonEntity,
    playerEntityId,
    playerEntity,
    systemCalls,
    components,
    networkConfig: network.networkConfig,
    wallet: getBurnerWallet(),
  };
};
