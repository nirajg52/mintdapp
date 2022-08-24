const hre = require("hardhat");

async function main() {
  const theWomenofAmerica = await hre.ethers.getContractFactory(
    "theWomenofAmerica"
  );
  const deployed = await theWomenofAmerica.deploy();

  await deployed.deployed();

  console.log(`Contract deployed to ${deployed.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
