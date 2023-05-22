// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { SFResourceGeneratorTable, SFOpenStreamTable } from "../codegen/Tables.sol";
import { ResourceGenerator } from "../superfluid/mining/ResourceGenerator.sol";

contract SapphireSystem is System {

  function setSapphireStream() public {
    // get sapphire contract address
    address sapphireAddress = SFResourceGeneratorTable.get(1);
    // get sapphire contract
    ResourceGenerator sapphire = ResourceGenerator(sapphireAddress);
    require(sapphireAddress != address(0), "Missing sapphire address!");
    SFOpenStreamTable.set(sapphireAddress, _msgSender(), 100000);
    // start stream
    sapphire.openStream(_msgSender());

  }

  function deleteSapphireStream(address receiver) public {
    // get sapphire contract address
    address sapphireAddress = SFResourceGeneratorTable.get(1);
    // get sapphire contract
    ResourceGenerator sapphire = ResourceGenerator(sapphireAddress);
    // close stream
    sapphire.closeStream(receiver);
    SFOpenStreamTable.deleteRecord(sapphireAddress, receiver);
  }

}