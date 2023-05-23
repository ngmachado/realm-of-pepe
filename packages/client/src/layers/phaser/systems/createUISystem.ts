import { Entity, getComponentValueStrict } from "@latticexyz/recs";
import { Assets } from "../constants";
import { PhaserLayer } from "../createPhaserLayer";
import { RealTimeBalance } from "../utils/StreamStore";
import { getUnixTime } from "date-fns";
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";

export const createUISystem = (layer: PhaserLayer) => {
  const {
    superfluid: { streamStore },
    game: { scale },
    scenes: {
      Main: { phaserScene },
    },
    networkLayer: {
      components: { SFSuperTokenTable },
    },
  } = layer;

  // const sapphireAddress = getComponentValueStrict(
  //   SFSuperTokenTable,
  //   "0x01" as Entity
  // );

  // const blueAddress = getComponentValueStrict(
  //   SFSuperTokenTable,
  //   "0x02" as Entity
  // );

  let sapphireRTB = streamStore.realtimeBalances.get("SPHR");
  let blueRTB = streamStore.realtimeBalances.get("Blue");

  streamStore.realtimeBalanceObservable.subscribe((realTimeBalance) => {
    const { token, ...rtb } = realTimeBalance;

    switch (token) {
      case "SPHR":
        sapphireRTB = rtb;
        break;
      case "Blue":
        blueRTB = rtb;
    }
    console.log("Subscribed new realtime balance", realTimeBalance);
  });

  const token1 = addText("0", 50, 10);
  const token2 = addText("0", 50, 60);

  setInterval(() => {
    if (sapphireRTB) {
      const newBalance = calculateRealtimeBalance(sapphireRTB);
      token1.setText(formatEther(newBalance.toString()));
    }

    if (blueRTB) {
      const newBalance = calculateRealtimeBalance(blueRTB);
      token2.setText(formatEther(newBalance.toString()));
    }
  }, 500);

  function calculateRealtimeBalance(rtb: RealTimeBalance): BigNumber {
    const { balance, flowRate, timestamp } = rtb;
    const unixNow = getUnixTime(new Date());

    return BigNumber.from(balance).add(
      BigNumber.from(unixNow - timestamp).mul(BigNumber.from(flowRate))
    );
  }

  function addText(label: string, x: number, y: number) {
    return phaserScene.add
      .text(x, y, label, {
        color: "#ffffff",
        fontSize: "24px",
        fontFamily: "VT323",
      })
      .setOrigin(0, 0)
      .setDepth(10)
      .setScrollFactor(0);
  }

  function addAssetIcon(frame: number, x: number, y: number) {
    return phaserScene.add
      .sprite(x, y, Assets.Crystals, frame)
      .setOrigin(0, 0)
      .setDepth(10)
      .setScrollFactor(0);
  }
};
