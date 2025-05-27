import { AppDataSource } from '@/configs/database';
import { voteService } from '@/services/vote.service';
import { blockchainService } from '@/services/blockchain.service';
import { pollService } from '@/services/poll.service';

async function testVoteIntegration() {
  try {
    // Initialize database
    await AppDataSource.initialize();
    console.log('Database connected');

    // Create a test poll
    const poll = await pollService.createPoll({
      title: 'Test Blockchain Poll',
      description: 'Testing blockchain integration',
      options: ['Option A', 'Option B', 'Option C'],
    });

    if (!poll) {
      throw new Error('Failed to create test poll');
    }

    console.log('Test poll created:', poll.id);

    // Test vote casting
    const testVoterId = 'test-voter-123';
    const testChoice = 'Option A';

    console.log('Casting vote...');
    const voteResult = await voteService.castVote(poll.id, testVoterId, testChoice);

    if (voteResult.success) {
      console.log('✅ Vote cast successfully!');
      console.log('Transaction hash:', voteResult.transactionHash);

      // Check vote status
      const hasVoted = await voteService.hasVoted(poll.id, testVoterId);
      console.log('Has voted (DB + Blockchain):', hasVoted);

      // Check blockchain events
      const events = await blockchainService.getVoteEvents();
      console.log('Recent vote events:', events.length);
    } else {
      console.log('❌ Vote failed:', voteResult.message);
    }

    // Test duplicate vote
    console.log('\nTesting duplicate vote...');
    const duplicateResult = await voteService.castVote(poll.id, testVoterId, 'Option B');
    console.log('Duplicate vote result:', duplicateResult.success ? '❌ Should have failed' : '✅ Correctly rejected');
    console.log('Message:', duplicateResult.message);
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await AppDataSource.destroy();
    console.log('Database connection closed');
  }
}

// Run the test
testVoteIntegration();
