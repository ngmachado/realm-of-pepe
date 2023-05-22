import { getComponentValue } from "@latticexyz/recs";
import { awaitStreamValue } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { worldSend, txReduced$, singletonEntity }: SetupNetworkResult,
  { Counter }: ClientComponents
) {
  const increment = async () => {
    const tx = await worldSend("increment", []);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(Counter, singletonEntity);
  };

  const spawn = async (x: number, y: number) => {
    worldSend("spawn", [x, y]);
  };

  const move = async (x: number, y: number) => {
    worldSend("move", [x, y]);
  };

  const setSapphireStream = async () => {
    await worldSend("setSapphireStream", []);
    // await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    // return getComponentValue(Counter, singletonEntity);
  };

  return {
    move,
    spawn,
    increment,
    setSapphireStream,
  };
}
