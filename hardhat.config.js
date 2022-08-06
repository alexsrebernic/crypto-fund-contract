require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy")
/** @type import('hardhat/config').HardhatUserConfig */
const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL;
const RINKEBY_PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY;
module.exports = {
  solidity: "0.8.9",
  networks: {
    defaultNetwork: "hardhat",
    "rinkeby": {
      url: RINKEBY_RPC_URL,
      accounts:[RINKEBY_PRIVATE_KEY],
    },
    "binance-testnet": {
    }
  },
  // gasReporter: {
  //   enabled: process.env.REPORT_GAS !== undefined,
  //   currency: 'USD',
  // },
  // etherscan: {
  //   apiKey: process.env.ETHERSCAN_API_KEY
  // },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    user: {
      default: 1,
    }
  }
};
