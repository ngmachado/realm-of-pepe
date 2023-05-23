// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ISuperfluid, ISuperToken} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import { SuperTokenV1Library } from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperTokenV1Library.sol";
import {SuperAppBaseCFA} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperAppBaseCFA.sol";

import { ERC721 } from "./base/ERC721.sol";

contract EvoBuilding is SuperAppBaseCFA, ERC721 {

	using SuperTokenV1Library for ISuperToken;

	struct UserInfo {
		uint256 timestamp;
		uint256 balance;
	}

	ISuperToken public immutable inResourceToken;
	int96 public maxInFlowRate;
	mapping(address => UserInfo) public userInfo;
	mapping(uint256 => string) public tokenURIs;
	uint256[] public tiers;
	uint256 public counter;

	constructor(
		string memory _name,
		string memory _symbol,
		ISuperToken _inResourceToken,
		int96 _maxInFlowRate,
		string[] memory _tokenURIs,
		uint256[] memory _tiers
	)
	SuperAppBaseCFA(ISuperfluid(_inResourceToken.getHost()), true, true, true)
	ERC721(_name, _symbol)
	{
		require(address(_inResourceToken) != address(0), "EVO: inResourceToken must be non-zero");
		require(_maxInFlowRate >= 0, "EVO: maxInFlowRate must be non-zero");
		require(_tokenURIs.length == _tiers.length, "EVO: tokenURIs and tiers must have the same length");
		for(uint256 i = 0; i < _tokenURIs.length; i++) {
			tokenURIs[i] = _tokenURIs[i];
			tiers.push(_tiers[i]);
		}
		inResourceToken = _inResourceToken;
		maxInFlowRate = _maxInFlowRate;
	}


	// change tokenURI
	function setTokenURI(uint256 tier, string memory uri) public {
		tokenURIs[tier] = uri;
	}

	// set Tier
	function setTier(uint256 tier, uint256 tierValue) public {
		tiers[tier] = tierValue;
	}

	// SuperApp

	function onFlowCreated(
		ISuperToken superToken,
		address sender,
		bytes calldata ctx
	) internal override returns (bytes memory newCtx) {
		newCtx = ctx;
		// user can't have already this NFT
		require(balanceOf(sender) == 0, "EVO: user already has NFT");
		int96 inFlowRate = superToken.getFlowRate(sender, address(this));
		require(inFlowRate <= maxInFlowRate, "EVO: user can't stream in more than maxInFlowRate");
		// register NFT and mint to user
		userInfo[sender].timestamp = block.timestamp;
		_mint(sender, ++counter);
	}

	function onFlowUpdated(
		ISuperToken superToken,
		address sender,
		int96 previousFlowRate,
		uint256 /*lastUpdated*/,
		bytes calldata ctx
	) internal override returns (bytes memory newCtx) {
		newCtx = ctx;
		// check if new flowrate is below maxInFlowRate
		int96 inFlowRate = superToken.getFlowRate(sender, address(this));
		require(inFlowRate <= maxInFlowRate, "EVO: user can't stream in more than maxInFlowRate");
		// settle balance
		_settleUserBalance(sender, previousFlowRate);
		// update timestamp
		userInfo[sender].timestamp = block.timestamp;
	}

	function onFlowDeleted(
		ISuperToken /*superToken*/,
		address sender,
		address /*receiver*/,
		int96 previousFlowRate,
		uint256 /*lastUpdated*/,
		bytes calldata ctx
	) internal override returns (bytes memory newCtx) {
		newCtx = ctx;
		// settle balance
		_settleUserBalance(sender, previousFlowRate);
	}

	function _settleUserBalance(address sender, int96 oldFlowrate) internal {
		// check if timestamp is not 0
		require(userInfo[sender].timestamp != 0, "EVO: user has no NFT");
		// make diff between timestamp and now
		uint256 diff = block.timestamp - userInfo[sender].timestamp;
		delete userInfo[sender].timestamp;
		// calculate balance
		userInfo[sender].balance = uint256(uint96(oldFlowrate)) * diff;
	}

	function transferFrom(address from, address to, uint256 id) public override {
		_closeStreamAndSettleUserBalance(from);
		super.transferFrom(from, to, id);
	}


	function safeTransferFrom(address from, address to, uint256 id, bytes calldata data) public override {
		_closeStreamAndSettleUserBalance(from);
		super.safeTransferFrom(from, to, id, data);
	}

	function safeTransferFrom(address from, address to, uint256 id) public override {
		_closeStreamAndSettleUserBalance(from);
		super.safeTransferFrom(from, to, id);
	}


	function _closeStreamAndSettleUserBalance(address sender) internal {
		require(userInfo[sender].timestamp != 0, "EVO: user has no NFT");
		int96 inFlowRate = inResourceToken.getFlowRate(sender, address(this));
		if(inFlowRate > 0) {
			_settleUserBalance(sender, inFlowRate);
			userInfo[sender].timestamp = block.timestamp;
			inResourceToken.deleteFlow(sender, address(this));
		}
	}

	function tokenURI(uint256 id) public view override returns (string memory) {
		require(_exists(id), "EVO: tokenURI query for nonexistent token");
		uint256 tierLevel = getTierLevel(id);
		// check if user is streaming in
		address sender = ownerOf(id);
		int96 inFlowRate = inResourceToken.getFlowRate(sender, address(this));
		if(inFlowRate > 0) {
			return tokenURIs[tierLevel];
		} else {
			return tokenURIs[0];
		}
	}

	function _getBalance(uint256 id) internal view returns (uint256) {
		int96 inFlowRate = inResourceToken.getFlowRate(ownerOf(id), address(this));
		return userInfo[ownerOf(id)].balance + uint256(uint96(inFlowRate)) * (block.timestamp - userInfo[ownerOf(id)].timestamp);
	}

	function getTierLevel(uint256 id) public view returns (uint256) {
		require(_exists(id), "EVO: tokenURI query for nonexistent token");
		uint256 balance = _getBalance(id);
		for (uint256 i = tiers.length-1; i > 0; i--) {
			if (balance >= tiers[i]) {
				return i;
			}
		}
		return 0;
	}

	function _exists(uint256 id) internal view returns (bool) {
		return _ownerOf[id] != address(0);
	}

	function isAcceptedSuperToken(ISuperToken _superToken) public view override returns (bool) {
		return address(_superToken) == address(inResourceToken);
	}

}
