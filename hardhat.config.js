require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy")
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL;
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
    hardhat: {
      chainId: 31337,
      gasPrice: 130000000000,
    },
    "goerli": {
      url: GOERLI_RPC_URL,
      accounts:[PRIVATE_KEY],
      chainId: 5,
      blockConfirmations: 6,
      gasPrice: 30000000000, // this is 30 Gwei
    },
    "binance-testnet": {
      url: BSCTESTNET_RPC_URL,
      accounts:[PRIVATE_KEY],
      chainId:97,
      blockConfirmations: 4
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
  gasReporter: {
    enabled: true,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    // coinmarketcap: COINMARKETCAP_API_KEY,
},
  namedAccounts: {
    deployer: {
      default: 0,
      1: 0,
    },
  }
};
