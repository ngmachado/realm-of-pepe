import { world } from "../../mud/world";
import { setup } from "../../mud/setup";
import { getBurnerWallet } from "@latticexyz/std-client";

export type NetworkLayer = Awaited<ReturnType<typeof createNetworkLayer>>;

export const createNetworkLayer = async () => {
  const {
    components,
    network: { singletonEntity, playerEntityId, playerEntity },
    systemCalls,
  } = await setup();

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
    wallet: getBurnerWallet(),
  };
};
