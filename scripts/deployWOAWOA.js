const hre = require("hardhat");

async function main() {
  const WOAWOA = await hre.ethers.getContractFactory("WOAWOA");
  const woawoa = await WOAWOA.deploy();

  await woawoa.deployed();

  console.log(`WOAWOA deployed to ${woawoa.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
