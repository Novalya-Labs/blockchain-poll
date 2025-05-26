import hre from 'hardhat';
import '@nomicfoundation/hardhat-ethers';

async function main(): Promise<void> {
  const VoteContract = await hre.ethers.getContractFactory('VoteContract');
  const voteContract = await VoteContract.deploy();
  await voteContract.waitForDeployment();

  const address = await voteContract.getAddress();
  console.log('VoteContract deployed to:', address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
