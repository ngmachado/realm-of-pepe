import { Framework } from "@superfluid-finance/sdk-core";
import { configureChains } from "@wagmi/core";
import { jsonRpcProvider } from "@wagmi/core/providers/jsonRpc";
import { ethers } from "ethers";
import { foundry } from "viem/chains";
import { NetworkLayer } from "./createNetworkLayer";

export interface SuperfluidLayer {
  framework: Framework;
}

export function createSuperfluidLayer(
  networkLayer: NetworkLayer
): Promise<SuperfluidLayer> {
  const {
    network: { networkConfig },
    components: { SFContractTable },
  } = networkLayer;

  const provider = new ethers.providers.JsonRpcProvider(
    networkConfig.provider.jsonRpcUrl
  );

  // const { chains, publicClient, webSocketPublicClient } = configureChains(
  //   [foundry],
  //   [
  //     jsonRpcProvider({
  //       rpc: () => ({
  //         http: networkConfig.provider.jsonRpcUrl,
  //       }),
  //     }),
  //   ]
  // );

  return new Promise((resolve) => {
    SFContractTable.update$.subscribe(async ({ entity, value }) => {
      console.log("UPDATEEEEEEE", entity, value[0]?.contractAddress);
      if (entity === "0x02") {
        const framework = await Framework.create({
          chainId: networkConfig.provider.chainId,
          provider,
          resolverAddress: value[0]?.contractAddress,
          protocolReleaseVersion: "test",
        });
        resolve({ framework });
      }
    });
  });
}
