// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { IWorld } from "../src/codegen/world/IWorld.sol";
import { SFContractTable, SFSuperTokenTable } from "../src/codegen/Tables.sol";

import {
  SuperfluidFrameworkDeployer, ISuperToken, ISuperfluid
} from "@superfluid-finance/ethereum-contracts/contracts/utils/SuperfluidFrameworkDeployer.sol";

import {
  SuperTokenDeployer, TestToken, SuperToken
} from "@superfluid-finance/ethereum-contracts/contracts/utils/SuperTokenDeployer.sol";

import { ISuperApp } from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperApp.sol";
import { IPureSuperToken } from "@superfluid-finance/ethereum-contracts/contracts/interfaces/tokens/IPureSuperToken.sol";
import { ResourceGenerator } from "../src/superfluid/mining/ResourceGenerator.sol";
import { EvoBuilding } from "../src/superfluid/building/EvoBuilding.sol";

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
    _setBuildings(world);

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
    // ID = 1
    IPureSuperToken pureSuperSapphire = tokenDeployer.deployPureSuperToken("Sapphire", "SPHR", 1000000000000000 ether);
    SFSuperTokenTable.set(world, 1, address(pureSuperSapphire));
    // deploy resourceGenerator contract for this token
    ResourceGenerator resourceGenerator = new ResourceGenerator(pureSuperSapphire, 10);
    // transfer all tokens to resourceGenerator
    pureSuperSapphire.transfer(address(resourceGenerator), 1000000000000000 ether);
    console.log("SuperToken Sapphire", address(pureSuperSapphire));
  }


  function _setBuildings(IWorld world) internal {
    console.log("PostDeploy._setBuildings()");

    // Deploy Storage
    string memory name = "EvoBuilding";
    string memory symbol = "EVO";
    address inResourceToken = SFSuperTokenTable.get(world, 1); //token a
    int96 maxInFlowRate = 600000; // amount we can stream by second

    string[] memory tokenURIs = new string[](4);
    tokenURIs[0] = "https://something.local/0";
    tokenURIs[1] = "https://something.local/1";
    tokenURIs[2] = "https://something.local/2";
    tokenURIs[3] = "https://something.local/3";

    uint256[] memory tiers = new uint256[](4);
    tiers[0] = 1 ether;
    tiers[1] = 2 ether;
    tiers[2] = 3 ether;
    tiers[3] = 4 ether;
    EvoBuilding building = new EvoBuilding(name, symbol, ISuperToken(inResourceToken), maxInFlowRate, tokenURIs, tiers);

    console.log("EvoBuilding", address(building));
    // must be register as SuperApp
    ISuperfluid host = ISuperfluid(SFContractTable.get(world, 1)); // get host
    host.isApp(ISuperApp(address(building)));

    console.log("EvoBuilding isApp", host.isApp(ISuperApp(address(building))));

  }
}