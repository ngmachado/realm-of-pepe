import { Provider } from "@ethersproject/providers";
import { Framework } from "@superfluid-finance/sdk-core";
import { Subject } from "rxjs";
import { getUnixTime } from "date-fns";
import { BigNumber, Contract } from "ethers";
import EvoBuildingABI from "./EvoBuildingABI";

export interface RealTimeBalance {
  flowRate: string;
  balance: string;
  timestamp: number;
}

export interface TokenRealtimeBalance extends RealTimeBalance {
  token: string;
}

const TOKENS_TO_LOAD = ["SPHR", "Blue"];

export class StreamStore {
  realtimeBalances = new Map();
  wallet: string;
  framework: Framework;
  provider: Provider;
  realtimeBalanceObservable = new Subject<TokenRealtimeBalance>();
  nftEvo = new Subject<number | null>();
  nftEvoStream: RealTimeBalance | null = null;

  constructor(framework: Framework, wallet: string, provider: Provider) {
    this.framework = framework;
    this.wallet = wallet;
    this.provider = provider;
    this.nftEvo.next(null);
  }

  async init() {
    return Promise.all(
      TOKENS_TO_LOAD.map((token) => {
        return this.loadRealTimeBalance(token);
      })
    );
  }

  async loadRealTimeBalance(token: string) {
    const superToken = await this.framework.loadSuperToken(token);
    const [realTimeFlow, realTimeBalance] = await Promise.all([
      superToken.getNetFlow({
        account: this.wallet,
        providerOrSigner: this.provider,
      }),
      superToken.realtimeBalanceOf({
        account: this.wallet,
        providerOrSigner: this.provider,
      }),
    ]);

    console.log("Real time balance loaded", {
      token,
      superToken,
      realTimeFlow,
      realTimeBalance,
    });

    const RTB = {
      flowRate: realTimeFlow,
      balance: realTimeBalance.availableBalance,
      timestamp: getUnixTime(realTimeBalance.timestamp),
    };

    this.realtimeBalances.set(token, RTB);
    this.realtimeBalanceObservable.next({ ...RTB, token });

    return realTimeBalance;
  }

  async loadBalanceOf(token: string, account: string) {
    const superToken = await this.framework.loadSuperToken(token);

    const superTokenBalance = await superToken.balanceOf({
      account,
      providerOrSigner: this.provider,
    });

    console.log("BalanceOf loaded", { superToken, superTokenBalance });

    return superTokenBalance;
  }

  // async loadFlow(token: string, account: string) {
  //   const superToken = await this.framework.loadSuperToken(token);
  //   const activeFlow = await superToken.getFlow({
  //     receiver: account,
  //     sender: this.wallet,
  //     providerOrSigner: this.provider,
  //   });
  // }

  async initNftTracking(address: string) {
    setInterval(() => this.trackNFT(address), 2000);
  }

  async trackNFT(address: string) {
    try {
      const contract = new Contract(address, EvoBuildingABI, this.provider);

      const result = await contract.callStatic.balanceOf(this.wallet);

      if (result && BigNumber.from(result).eq(BigNumber.from("0x01"))) {
        const tokenURI = await contract.callStatic.tokenURI(1);
        console.log("NFT FOUND", tokenURI);
        this.nftEvo.next(Number(tokenURI));

        if (!this.nftEvoStream) {
          this.nftEvoStream = {
            flowRate: "500000000",
            balance: "0",
            timestamp: getUnixTime(new Date()),
          };
        }
        return;
      }

      this.nftEvo.next(null);
    } catch (e: any) {
      console.log("No NFT found", e);
    }
  }
}
