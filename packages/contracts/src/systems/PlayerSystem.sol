// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { Position } from "../codegen/Tables.sol";
import { Utils } from "../Utils.sol";

contract PlayerSystem is System {

  function spawn(int32 x, int32 y) public {
    bytes32 entityKey = Utils.addressToEntityKey(_msgSender());

    Position.set(entityKey, x, y);
  }
}
