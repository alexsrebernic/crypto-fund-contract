const { getNamedAccounts, deployments, network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const {verify} = require("../utils/verify")
const fs = require('fs')

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    let donationsAddress;
    let ethUsdPriceFeedAddress
    if (chainId == 31337) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }
    const donee = await deploy("Donee", {
        from: deployer,
        args:[ethUsdPriceFeedAddress],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`Donee deployed at ${donee.address}`);
    if (
        !developmentChains.includes(network.name) && 
        (process.env.ETHERSCAN_API_KEY && process.env.BSCSCAN_API_KEY)
    ) { 
        await verify(donee.address,[ethUsdPriceFeedAddress])
    }
    log('---------------------------------------------')
}

module.exports.tags = ["all", "donee"]
