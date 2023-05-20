// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { SuperTokenV1Library, ISuperToken } from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperTokenV1Library.sol";

// Each resource generator only generates one resource type with a fixed rate.
contract ResourceGenerator {

	using SuperTokenV1Library for ISuperToken;

	event StreamOpened(address indexed receiver);
	event StreamClosed(address indexed receiver);
	event RateOfGenerationChanged(int96 newRate);

	// resource type
	ISuperToken public superToken;

	// resource generation rate
	int96 public rateOfGeneration;

	constructor(ISuperToken _superToken, int96 _rateOfGeneration) {
		require(_rateOfGeneration > 0, "ResourceGenerator: rateOfGeneration must be positive");
		require(address(_superToken) != address(0), "ResourceGenerator: superToken must be non-zero");
		superToken = _superToken;
		rateOfGeneration = _rateOfGeneration;
	}

	// open stream from this contract to the receiver
	function openStream(address receiver) external {
		superToken.createFlow(receiver, rateOfGeneration);
		emit StreamOpened(receiver);
	}

	// close stream from this contract to the receiver
	function closeStream(address receiver) external {
		superToken.deleteFlow(address(this), receiver);
		emit StreamClosed(receiver);
	}

	// change the rate of generation, for next streams.
	// this method only affect new streams, not existing ones.
	function changeRateOfGeneration(int96 newRateOfGeneration) external {
		require(newRateOfGeneration > 0, "ResourceGenerator: rateOfGeneration must be positive");
		rateOfGeneration = newRateOfGeneration;
		emit RateOfGenerationChanged(newRateOfGeneration);
	}
}
