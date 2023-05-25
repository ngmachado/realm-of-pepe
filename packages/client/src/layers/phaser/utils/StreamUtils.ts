import { getUnixTime } from "date-fns";
import { RealTimeBalance } from "./StreamStore";
import { BigNumber } from "ethers";

export function calculateRealtimeBalance(rtb: RealTimeBalance): BigNumber {
  const { balance, flowRate, timestamp } = rtb;
  const unixNow = getUnixTime(new Date());

  return BigNumber.from(balance).add(
    BigNumber.from(unixNow - timestamp).mul(BigNumber.from(flowRate))
  );
}
