import { ethers } from 'ethers';
import { contract } from '@/configs/blockchain';
import { zkpUtils } from '@/utils/zkp';

export class BlockchainService {
  async castVoteOnChain(
    voterId: string,
    voteChoice: string,
  ): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
      // Generate ZKP proof
      const zkpProof = await zkpUtils.generateProof(voterId, voteChoice);

      // Verify the proof before submitting to blockchain
      const isValidProof = await zkpUtils.verifyProof(zkpProof.proof, zkpProof.publicSignals);
      if (!isValidProof) {
        return { success: false, error: 'Invalid ZKP proof' };
      }

      // Create hashes for blockchain
      const voterIdHash = ethers.keccak256(ethers.toUtf8Bytes(voterId));
      const voteHash = ethers.keccak256(ethers.toUtf8Bytes(voteChoice));

      // Check if user already voted on blockchain
      const hasVoted = await contract.hasVoted(voterIdHash);
      if (hasVoted) {
        return { success: false, error: 'User already voted on blockchain' };
      }

      // Submit vote to blockchain
      const tx = await contract.vote(voterIdHash, voteHash);
      await tx.wait(); // Wait for transaction confirmation

      console.log('Vote successfully recorded on blockchain:', {
        txHash: tx.hash,
        voterId: `${voterId.substring(0, 8)}...`,
        voteChoice,
      });

      return { success: true, txHash: tx.hash };
    } catch (error) {
      console.error('Blockchain vote error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown blockchain error',
      };
    }
  }

  async hasVotedOnChain(voterId: string): Promise<boolean> {
    try {
      const voterIdHash = ethers.keccak256(ethers.toUtf8Bytes(voterId));
      return await contract.hasVoted(voterIdHash);
    } catch (error) {
      console.error('Error checking vote status on blockchain:', error);
      return false;
    }
  }

  async getVoteEvents(fromBlock = 0) {
    try {
      const filter = contract.filters.Voted();
      const events = await contract.queryFilter(filter, fromBlock);
      return events.map((event) => {
        if ('args' in event) {
          return {
            voterIdHash: event.args[0],
            voteHash: event.args[1],
            blockNumber: event.blockNumber,
            transactionHash: event.transactionHash,
          };
        }
        return {
          voterIdHash: null,
          voteHash: null,
          blockNumber: event.blockNumber,
          transactionHash: event.transactionHash,
        };
      });
    } catch (error) {
      console.error('Error fetching vote events:', error);
      return [];
    }
  }
}

export const blockchainService = new BlockchainService();
