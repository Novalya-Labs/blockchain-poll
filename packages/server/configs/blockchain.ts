import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider('http://localhost:8545');
const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
const wallet = new ethers.Wallet(privateKey, provider);

const contractAddress = process.env.VOTE_CONTRACT_ADDRESS as string;
const abi = [
  'function vote(bytes32 _voterIdHash, bytes32 _voteHash) external',
  'function hasVoted(bytes32 _voterIdHash) view returns (bool)',
];

const contract = new ethers.Contract(contractAddress, abi, wallet);

export { provider, wallet, contract };
