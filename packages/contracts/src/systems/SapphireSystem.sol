// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { SFResourceGeneratorTable } from "../codegen/Tables.sol";
import { ResourceGenerator } from "../superfluid/mining/ResourceGenerator.sol";

contract SapphireSystem is System {

  function setSapphireStream() public returns (bool) {
    // get sapphire contract address
    address sapphireAddress = SFResourceGeneratorTable.get(1);
    // get sapphire contract
    ResourceGenerator sapphire = ResourceGenerator(sapphireAddress);
    // start stream
    sapphire.openStream(_msgSender());
    return true;
  }

  function deleteSapphireStream(address receiver) public returns (bool) {
    // get sapphire contract address
    address sapphireAddress = SFResourceGeneratorTable.get(1);
    // get sapphire contract
    ResourceGenerator sapphire = ResourceGenerator(sapphireAddress);
    // close stream
    sapphire.closeStream(receiver);
    return true;
  }

}