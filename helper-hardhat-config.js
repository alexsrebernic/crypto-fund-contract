const networkConfig = {
    31337: {
        name: "localhost",
    },
    5: {
        name: "goerli",
        ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e"
    },
    97: {
        name: "binance-testnet",
        ethUsdPriceFeed: "0x143db3CEEfbdfe5631aDD3E50f7614B6ba708BA7"
    }

}

const developmentChains = ["hardhat", "localhost"]

module.exports = {
    networkConfig,
    developmentChains
}