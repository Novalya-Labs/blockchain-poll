import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider('http://localhost:8545');
const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
const wallet = new ethers.Wallet(privateKey, provider);

const contractAddress = process.env.VOTE_CONTRACT_ADDRESS || '0x5fbdb2315678afecb367f032d93f642f64180aa3';
const abi = [
  'function vote(bytes32 _voterIdHash, bytes32 _voteHash) external',
  'function hasVoted(bytes32 _voterIdHash) view returns (bool)',
  'event Voted(bytes32 indexed voterIdHash, bytes32 voteHash)',
];

if (!contractAddress) {
  throw new Error('VOTE_CONTRACT_ADDRESS environment variable is required');
}

const contract = new ethers.Contract(contractAddress, abi, wallet);

export { provider, wallet, contract, contractAddress };
