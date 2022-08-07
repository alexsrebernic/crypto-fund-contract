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
    fs.readFileSync('../utils/Donations_address.txt',(err, data) => {
        if(err) throw err;
        donationsAddress = data.toString();
    })
    const donations = await deploy("Donee", {
        from: deployer,
        args:["Alex","Srebernic","#4287f5","Test","07/08/2022",ethUsdPriceFeedAddress,donationsAddress],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`Donations deployed at ${donations.address}`);
    if (
        !developmentChains.includes(network.name) &&
        (process.env.ETHERSCAN_API_KEY || process.env.BSCSCAN_API_KEY)
    ) {
        await verify(fundMe.address)
    }

}

module.exports.tags = ["all", "donee"]
