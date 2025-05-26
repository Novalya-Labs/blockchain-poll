// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VoteContract {
    mapping(bytes32 => bool) public hasVoted;
    event Voted(bytes32 indexed voterIdHash, bytes32 voteHash);

    function vote(bytes32 _voterIdHash, bytes32 _voteHash) external {
        require(!hasVoted[_voterIdHash], "Deja vote.");
        hasVoted[_voterIdHash] = true;
        emit Voted(_voterIdHash, _voteHash);
    }
}
