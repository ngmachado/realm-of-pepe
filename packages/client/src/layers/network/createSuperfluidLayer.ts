import { Framework } from "@superfluid-finance/sdk-core";
import { configureChains, createConfig } from "@wagmi/core";
import { jsonRpcProvider } from "@wagmi/core/providers/jsonRpc";
import { ethers } from "ethers";
import { foundry } from "viem/chains";
import { NetworkLayer } from "./createNetworkLayer";
import { StreamStore } from "../phaser/utils/StreamStore";
import { Provider } from "@ethersproject/providers";

export interface SuperfluidLayer {
  framework: Framework;
  streamStore: StreamStore;
  provider: Provider;
}

export function createSuperfluidLayer(
  networkLayer: NetworkLayer
): Promise<SuperfluidLayer> {
  const {
    network,
    components: { SFContractTable },
  } = networkLayer;

  const { networkConfig } = network;

  const provider = new ethers.providers.JsonRpcProvider(
    networkConfig.provider.jsonRpcUrl
  );

  const { chains, publicClient, webSocketPublicClient } = configureChains(
    [foundry],
    [
      jsonRpcProvider({
        rpc: () => ({
          http: networkConfig.provider.jsonRpcUrl,
        }),
      }),
    ]
  );

  createConfig({
    publicClient,
    webSocketPublicClient,
  });

  return new Promise((resolve) => {
    SFContractTable.update$.subscribe(async ({ entity, value }) => {
      if (entity === "0x02") {
        const framework = await Framework.create({
          chainId: networkConfig.provider.chainId,
          provider,
          resolverAddress: value[0]?.contractAddress,
          protocolReleaseVersion: "test",
        });

        const streamStore = new StreamStore(
          framework,
          network.playerEntityId as string,
          provider
        );

        await streamStore.init();

        resolve({ framework, streamStore, provider });
      }
    });
  });
}
