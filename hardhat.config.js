require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy")
require("dotenv").config()
/** @type import('hardhat/config').HardhatUserConfig */
const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const BSCTESTNET_RPC_URL = process.env.BSCTESTNET_RPC_URL;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const BSCSCAN_API_KEY = process.env.BSCSCAN_API_KEY
module.exports = {
  solidity: {
    compilers: [
        {
            version: "0.8.9",
        },
        {
            version: "0.6.6",
        },
    ],
  },
  networks: {
    "rinkeby": {
      url: RINKEBY_RPC_URL,
      accounts:[PRIVATE_KEY],
    },
    "binance-testnet": {
      url: BSCTESTNET_RPC_URL,
      accounts:[PRIVATE_KEY]
    }
  },
  // gasReporter: {
  //   enabled: process.env.REPORT_GAS !== undefined,
  //   currency: 'USD',
  // },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  },
  bscscan: {
    apiKey: BSCSCAN_API_KEY
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    user: {
      default: 1,
    }
  }
};
