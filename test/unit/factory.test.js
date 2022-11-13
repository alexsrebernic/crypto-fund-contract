const { assert, expect } = require("chai")
const { network, deployments, ethers, } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
? describe.skip
: describe("Factory", function () {
      let factory
      let mockV3Aggregator
      let deployer
      const sendValue = ethers.utils.parseEther("1")
      beforeEach(async () => {
          deployer = (await getNamedAccounts()).deployer
          await deployments.fixture(["all"])
          factory = await ethers.getContract("Factory", deployer)
          mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        )
      })
      describe("Write", () => {
        it("Add donee", async () => {
            await factory.createNewDonee()
            const response = await factory.getDonors()
            expect(response).to.be.an('array').lengthOf(1);
        }) 
        it("Detect event newDonee", async () => {
          const factoryPromise = await factory.createNewDonee()
          expect(factoryPromise).to.emit(factory, "newDonee")
        }) 
      })
})