import { createClientComponents } from "./createClientComponents";
import { createSystemCalls } from "./createSystemCalls";
import { setupNetwork } from "./setupNetwork";

import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";

export type SetupResult = Awaited<ReturnType<typeof setup>>;

export async function setup() {

  const network = await setupNetwork();
  const components = createClientComponents(network);
  const systemCalls = createSystemCalls(network, components);

  // create a new ethers provider
  const superfluid = Framework.create({
    chainId: network.networkConfig.provider.chainId,
    provider: new ethers.providers.JsonRpcProvider(network.networkConfig.provider.jsonRpcUrl),
    resolverAddress: "0x9967D6bc6f5093d036D10ea69B26B48F68780c89", //todo: get from mud
    protocolReleaseVersion: "test",
  });

  return {
    network,
    components,
    systemCalls,
    superfluid,
  };
}
