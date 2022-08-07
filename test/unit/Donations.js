const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
? describe.skip
: describe("FundMe", function () {
      let donations
      let donee
      let deployer
      beforeEach(async () => {
          deployer = (await getNamedAccounts()).deployer
          await deployments.fixture(["all"])
          donations = await ethers.getContract("Donations", deployer)
          donee = await ethers.getContract("Donee", deployer)
      })

  })