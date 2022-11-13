const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const {verify} = require("../utils/verify")
const fs = require('fs')

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;
    let ethUsdPriceFeedAddress;
    log(`chainID : ${chainId}`);
    if (chainId == 31337) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator");
        ethUsdPriceFeedAddress = ethUsdAggregator.address;
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
    }
    log(`ethUsdPriceFeedAddress : ${ethUsdPriceFeedAddress}`)
    log(`blockConfirmations : ${network.config.blockConfirmations}`)
    log(`deployer : ${deployer}`)

    const factory = await deploy("Factory", {
        contract: "Factory",
        from: deployer,
        args:[ethUsdPriceFeedAddress],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });
    log(`Factory:${factory.deployed}`)
    log(`Factory deployed at ${factory.address}`);
    if (
        !developmentChains.includes(network.name) && 
        (process.env.ETHERSCAN_API_KEY && process.env.BSCSCAN_API_KEY)
    ) { 
        await verify(factory.address,[ethUsdPriceFeedAddress])
    }
    log('---------------------------------------------');
}
module.exports.tags = ["all", "factory"]