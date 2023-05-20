// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ISuperfluid, ISuperToken} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import { SuperTokenV1Library } from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperTokenV1Library.sol";
import {SuperAppBaseCFA} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperAppBaseCFA.sol";

contract Store is SuperAppBaseCFA {

    using SuperTokenV1Library for ISuperToken;

    ISuperToken public immutable inResourceToken;
    ISuperToken public immutable outResourceToken;
    int8 public rateConversion;
    int96 public maxInFlowRate;

    constructor(
        ISuperToken _inResourceToken,
        ISuperToken _outResourceToken,
        int8 _rateConversion,
        int96 _maxInFlowRate
    ) SuperAppBaseCFA(
    ISuperfluid(_inResourceToken.getHost()), true, true, true) {

        require(address(_inResourceToken) != address(0), "Store: inResourceToken must be non-zero");
        require(address(_outResourceToken) != address(0), "Store: outResourceToken must be non-zero");
        require(_rateConversion >= -100 && _rateConversion <= 100, "Store: rateConversion must be between -100 and 100");
        require(_maxInFlowRate >= 0, "Store: maxInFlowRate must be non-zero");

        inResourceToken = _inResourceToken;
        outResourceToken = _outResourceToken;
        rateConversion = _rateConversion;
        maxInFlowRate = _maxInFlowRate;
    }

    // out put resource token is based on in resource token flowRate and rateConversion
    // convertion rate is a percentage that is added to the flowRate, can be positive (add more to output) or negative (subtract from output)
    function _calculateOutputFlowRate(int96 _inFlowRate) internal view returns (int96) {
        return _inFlowRate + (_inFlowRate * rateConversion / 1e18);
    }

    /// @dev super app callback triggered after user sends stream to contract
    function onFlowCreated(
        ISuperToken superToken,
        address sender,
        bytes calldata ctx
    ) internal override returns (bytes memory newCtx) {
        newCtx = ctx;
        // how much is user streaming in
        int96 inFlowRate = superToken.getFlowRate(sender, address(this));
        require(inFlowRate <= maxInFlowRate, "Store: inFlowRate too high");
        // how much should this app stream out
        int96 outFlowRate = _calculateOutputFlowRate(inFlowRate);
        newCtx = outResourceToken.createFlowWithCtx(sender, outFlowRate, ctx);
    }

    function onFlowUpdated(
        ISuperToken /*superToken*/,
        address /*sender*/,
        int96 /*previousFlowRate*/,
        uint256 /*lastUpdated*/,
        bytes calldata /*ctx*/
    ) internal override returns (bytes memory /*newCtx*/) {
        revert("can't update sorry bye");
    }

    function onFlowDeleted(
        ISuperToken superToken,
        address sender,
        address receiver,
        int96 /*previousFlowRate*/,
        uint256 /*lastUpdated*/,
        bytes calldata ctx
    ) internal override returns (bytes memory newCtx) {
        newCtx = ctx;
        // user closed store stream
        if(address(superToken) == address(outResourceToken)) {
            // check if we are getting anything from user
            int96 inFlowRate = inResourceToken.getFlowRate(receiver, address(this));
            if(inFlowRate != 0) {
                newCtx = inResourceToken.deleteFlowWithCtx(receiver, address(this), newCtx);
            }
        } else {
            // user closed user stream
            int96 outFlowRate = outResourceToken.getFlowRate(address(this), receiver);
            if(outFlowRate != 0) {
                newCtx = outResourceToken.deleteFlowWithCtx(address(this), receiver, newCtx);
            }
        }
    }

    // transfer tokens to another addresses
    function transfer(ISuperToken superToken, address _to, uint256 _amount) external {
        superToken.transfer(_to, _amount);
    }

    function isAcceptedSuperToken(ISuperToken _superToken) public view override returns (bool) {
        return address(_superToken) == address(inResourceToken);
    }
}
