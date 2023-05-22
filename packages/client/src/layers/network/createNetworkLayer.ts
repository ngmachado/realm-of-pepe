import { getBurnerWallet } from "@latticexyz/std-client";
import { setup } from "../../mud/setup";
import { world } from "../../mud/world";

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
    network,
    wallet: getBurnerWallet(),
  };
};
