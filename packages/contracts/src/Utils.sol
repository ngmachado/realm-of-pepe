// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

library Utils {

  function addressToEntityKey(address _address) internal pure returns (bytes32 key) {
    return bytes32(uint256(uint160(_address)));
  }

}