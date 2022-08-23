require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
const dotenv = require("dotenv");

dotenv.config();

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.adress);
  }
});

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    rinkeby: {
      url: process.env.REACT_APP_RINKEBY_URL,
      accounts: [process.env.OWNER_PRIVATE_KEY],
    },
  },

  etherscan: {
    apiKey: {
      rinkeby: process.env.REACT_APP_RINKEBYSCAN_KEY,
    },
  },
};
