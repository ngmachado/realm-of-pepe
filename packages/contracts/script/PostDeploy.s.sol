// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { IWorld } from "../src/codegen/world/IWorld.sol";
import {
  SFContractTable,
  SFSuperTokenTable,
  SFResourceGeneratorTable,
  SFStoreTable
} from "../src/codegen/Tables.sol";

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
import { Store } from "../src/superfluid/store/Store.sol";

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

    console.log("Host (storage id 1)", address(sf.host));
    console.log("Resolver (storage id 2)", address(sf.resolver));
    console.log("CFA (storage id 3)", address(sf.cfa));
    console.log("SuperTokenFactory", address(sf.superTokenFactory));

    // register SF base contracts to storage (host (id 1), resolver (id 2) and CFA (id 3)
    SFContractTable.set(world, 1, address(sf.host));
    SFContractTable.set(world, 2, address(sf.resolver));
    SFContractTable.set(world, 3, address(sf.cfa));

    SuperTokenDeployer tokenDeployer = new SuperTokenDeployer(address(sf.superTokenFactory), address(sf.resolver));
    sf.resolver.addAdmin(address(tokenDeployer));

    // deploy all streamable resources tokens
    IPureSuperToken pureSuperSapphire = tokenDeployer.deployPureSuperToken("Sapphire", "SPHR", 1000000000000000 ether);
    SFSuperTokenTable.set(world, 1, address(pureSuperSapphire));
    console.log("SuperToken Sapphire (storage id 1)", address(pureSuperSapphire));

    IPureSuperToken pureSuperBlue = tokenDeployer.deployPureSuperToken("BluePotion", "Blue", 1000000000000000 ether);
    SFSuperTokenTable.set(world, 2, address(pureSuperBlue));
    console.log("SuperToken BluePotion (storage id 2)", address(pureSuperBlue));

    // deploy resourceGenerator contract for this token - Player gets 100000 sapphire parts per second
    // user should get 1 full token per minute
    ResourceGenerator resourceGenerator = new ResourceGenerator(pureSuperSapphire, 33333333333333332);
    SFResourceGeneratorTable.set(world, 1, address(resourceGenerator));
    console.log("ResourceGenerator Sapphire (storage id 1)", address(resourceGenerator));

    // deploy Store contract with sapphire as stream in token and blue as stream out token
    Store store = new Store(pureSuperSapphire, pureSuperBlue, 0, 33333333333333332);
    SFStoreTable.set(world, 1, address(store), address(pureSuperSapphire), address(pureSuperBlue), 33333333333333332);
    // transfer all tokens to resourceGenerator
    console.log("Store Sapphire/BluePotion (storage id 1)", address(store));

    pureSuperSapphire.transfer(address(resourceGenerator), 1000000000000000 ether);
    console.log("> Transferred 1000000000000000 tokens sapphire to ResourceGenerator");
    console.log("> ResourceGenerator Sapphire balance", pureSuperSapphire.balanceOf(address(resourceGenerator)));

    pureSuperBlue.transfer(address(store), 1000000000000000 ether);
    console.log("> Transferred 1000000000000000 tokens blue potion to store");
    console.log("> Store BluePotion balance", pureSuperBlue.balanceOf(address(store)));

    // check is store is superApp
    console.log("Store isApp: ", sf.host.isApp(ISuperApp(address(store))));
  }


  function _setBuildings(IWorld world) internal {
    console.log("PostDeploy._setBuildings()");

    // Deploy Storage
    string memory name = "PepeArmy";
    string memory symbol = "0_x";
    address bluePotionAddress = SFSuperTokenTable.get(world, 2); //BluePotion
    int96 maxInFlowRate = 33333333333333332; // amount we can stream by second

    string[] memory tokenURIs = new string[](5);
    tokenURIs[0] = "0";
    tokenURIs[1] = "1";
    tokenURIs[2] = "2";
    tokenURIs[3] = "3";
    tokenURIs[4] = "4";

    uint256[] memory tiers = new uint256[](5);
    tiers[0] = 500000000 * 10;
    tiers[1] = 500000000 * 20;
    tiers[2] = 500000000 * 30;
    tiers[3] = 500000000 * 40;
    tiers[4] = 500000000 * 50;
    EvoBuilding building = new EvoBuilding(name, symbol, ISuperToken(bluePotionAddress), maxInFlowRate, tokenURIs, tiers);

    console.log("EvoPepeArmy", address(building));
    SFSuperTokenTable.set(world, 3, address(address(building)));
    // must be register as SuperApp
    ISuperfluid host = ISuperfluid(SFContractTable.get(world, 1)); // get host

    console.log("EvoPepeArmy isApp: ", host.isApp(ISuperApp(address(building))));

  }
}