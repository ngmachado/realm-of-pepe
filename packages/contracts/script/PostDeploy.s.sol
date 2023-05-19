// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { IWorld } from "../src/codegen/world/IWorld.sol";

// get Superfluid deployer
import {
  SuperfluidFrameworkDeployer
} from "@superfluid-finance/ethereum-contracts/contracts/utils/SuperfluidFrameworkDeployer.sol";

contract PostDeploy is Script {

  SuperfluidFrameworkDeployer internal sfDeployer;

  SuperfluidFrameworkDeployer.Framework internal sf;

  function run(address worldAddress) external {
    console.log("PostDeploy.run()");
    // Load the private key from the `PRIVATE_KEY` environment variable (in .env)
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

    // Start broadcasting transactions from the deployer account
    vm.startBroadcast(deployerPrivateKey);

    sfDeployer = new SuperfluidFrameworkDeployer();
    sf = sfDeployer.getFramework();
    console.log("Resolver", address(sf.resolver));
    console.log("Host", address(sf.host));
    //resolver = sf.resolver;

    vm.stopBroadcast();
  }
}
