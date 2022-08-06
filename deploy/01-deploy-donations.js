const { getNamedAccounts, deployments, network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId
    const donations = await deploy("Donations", {
        from: deployer,
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

module.exports.tags = ["all", "donations"]
