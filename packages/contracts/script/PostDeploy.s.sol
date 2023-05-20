// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { IWorld } from "../src/codegen/world/IWorld.sol";
import { SFContractTable, SFSuperTokenTable } from "../src/codegen/Tables.sol";

import {
  SuperfluidFrameworkDeployer
} from "@superfluid-finance/ethereum-contracts/contracts/utils/SuperfluidFrameworkDeployer.sol";

import {
  SuperTokenDeployer, TestToken, SuperToken
} from "@superfluid-finance/ethereum-contracts/contracts/utils/SuperTokenDeployer.sol";

import { IPureSuperToken } from "@superfluid-finance/ethereum-contracts/contracts/interfaces/tokens/IPureSuperToken.sol";

contract PostDeploy is Script {

  function run(address worldAddress) external {
    console.log("PostDeploy.run()");
    IWorld world = IWorld(worldAddress);
    // Load the private key from the `PRIVATE_KEY` environment variable (in .env)
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    // Start broadcasting transactions from the deployer account
    vm.startBroadcast(deployerPrivateKey);

    _setSFContracts(world);
    _setMap(world);

    vm.stopBroadcast();
  }


  function _setMap(IWorld world) internal {
    console.log("PostDeploy._setMap()");
  }

  function _setSFContracts(IWorld world) internal {
    console.log("PostDeploy._setSFContracts()");

    SuperfluidFrameworkDeployer sfDeployer = new SuperfluidFrameworkDeployer();
    SuperfluidFrameworkDeployer.Framework memory sf = sfDeployer.getFramework();

    console.log("Resolver", address(sf.resolver));
    console.log("Host", address(sf.host));
    console.log("CFA", address(sf.cfa));
    console.log("SuperTokenFactory", address(sf.superTokenFactory));

    // register SF base contracts to storage (host (id 1), resolver (id 2) and CFA (id 3)
    SFContractTable.set(world, 1, address(sf.host));
    SFContractTable.set(world, 2, address(sf.resolver));
    SFContractTable.set(world, 3, address(sf.cfa));

    SuperTokenDeployer tokenDeployer = new SuperTokenDeployer(address(sf.superTokenFactory), address(sf.resolver));
    sf.resolver.addAdmin(address(tokenDeployer));

    // deploy all streamable resources tokens
    IPureSuperToken pureSuperTokenA = tokenDeployer.deployPureSuperToken("TokenA", "TokenA", 1000000000000000 ether);
    IPureSuperToken pureSuperTokenB = tokenDeployer.deployPureSuperToken("TokenB", "TokenB", 1000000000000000 ether);
    IPureSuperToken pureSuperTokenC = tokenDeployer.deployPureSuperToken("TokenC", "TokenC", 1000000000000000 ether);
    IPureSuperToken pureSuperTokenD = tokenDeployer.deployPureSuperToken("TokenD", "TokenD", 1000000000000000 ether);

    SFSuperTokenTable.set(world, 1, address(pureSuperTokenA));
    SFSuperTokenTable.set(world, 2, address(pureSuperTokenB));
    SFSuperTokenTable.set(world, 3, address(pureSuperTokenC));
    SFSuperTokenTable.set(world, 4, address(pureSuperTokenD));

    console.log("SuperToken A", address(pureSuperTokenA));
    console.log("SuperToken B", address(pureSuperTokenB));
    console.log("SuperToken C", address(pureSuperTokenC));
    console.log("SuperToken D", address(pureSuperTokenD));

  }
}