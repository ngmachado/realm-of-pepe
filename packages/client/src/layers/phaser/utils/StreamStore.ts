import { Provider } from "@ethersproject/providers";
import { Framework } from "@superfluid-finance/sdk-core";
import { Signer } from "ethers";

const TOKENS_TO_LOAD = ["SPHR", "Blue"];

export class StreamStore {
  activeFlows = new Map();
  wallet: string;
  framework: Framework;
  provider: Provider;

  constructor(framework: Framework, wallet: string, provider: Provider) {
    this.framework = framework;
    this.wallet = wallet;
    this.provider = provider;
  }

  async init() {
    return Promise.all(
      TOKENS_TO_LOAD.map((token) => {
        return this.loadRealTimeBalance(token);
      })
    );
  }

  async loadRealTimeBalance(token: string) {
    console.log("Loading token", token, this.framework);
    const superToken = await this.framework.loadSuperToken(token);

    const realTimeBalance = await superToken.realtimeBalanceOf({
      account: this.wallet,
      providerOrSigner: this.provider,
    });

    console.log("Real time balance loaded", { token, realTimeBalance });

    return realTimeBalance;
  }

  async loadBalanceOf(token: string, account: string) {
    console.log("Loading token", token, this.framework);
    const superToken = await this.framework.loadSuperToken(token);

    const superTokenBalance = await superToken.balanceOf({
      account,
      providerOrSigner: this.provider,
    });

    console.log("BalanceOf loaded", { superToken, superTokenBalance });

    return superTokenBalance;
  }
}
