import { ethers } from 'hardhat';

async function main(): Promise<void> {
  const VoteContract = await ethers.getContractFactory('VoteContract');
  const voteContract = await VoteContract.deploy();
  await voteContract.waitForDeployment();

  const address = await voteContract.getAddress();
  console.log('VoteContract deployed to:', address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
