const { assert } = require("chai")
const { network, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("Donee Staging Tests", function () {
          let deployer
          let donee
          const sendValue = ethers.utils.parseEther("0.1")
          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              fundMe = await ethers.getContract("Donee", deployer)
          })

          it("allows people to fund and withdraw", async function () {
              const fundTxResponse = await donee.fund({ value: sendValue })
              await fundTxResponse.wait(1)
              const withdrawTxResponse = await donee.withdraw()
              await withdrawTxResponse.wait(1)

              const endingDoneeMeBalance = await donee.provider.getBalance(
                donee.address
              )
              console.log(
                endingDoneeMeBalance.toString() +
                      " should equal 0, running assert equal..."
              )
              assert.equal(endingDoneeMeBalance.toString(), "0")
          })
      })