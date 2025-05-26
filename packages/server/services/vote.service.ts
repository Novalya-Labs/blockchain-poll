import { contract } from '@/configs/blockchain';
import { zkpUtils } from '@/utils/zkp';
import { ethers } from 'ethers';

export const voteService = {
  castVote: async (voterId: string, voteChoice: string) => {
    const { proof, publicSignals } = await zkpUtils.generateProof(voterId, voteChoice);

    const isValid = await zkpUtils.verifyProof(proof, publicSignals);
    if (!isValid) {
      throw new Error('Invalid ZKP proof.');
    }

    const voterIdHash = ethers.keccak256(ethers.toUtf8Bytes(voterId));
    const voteHash = ethers.keccak256(ethers.toUtf8Bytes(voteChoice));

    const alreadyVoted = await contract.hasVoted(voterIdHash);
    if (alreadyVoted) {
      throw new Error('Already voted');
    }

    const tx = await contract.vote(voterIdHash, voteHash);
    await tx.wait();
  },
};
