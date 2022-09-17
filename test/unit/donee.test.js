const { assert, expect } = require("chai")
const { network, deployments, ethers, } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
? describe.skip
: describe("Donee", function () {
      let donee
      let mockV3Aggregator
      let deployer
      const sendValue = ethers.utils.parseEther("1")
      beforeEach(async () => {
          deployer = (await getNamedAccounts()).deployer
          await deployments.fixture(["all"])
          donee = await ethers.getContract("Donee", deployer)
          mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        )
      })
      describe("Read", () => {
          it("Get donors", async () => {
            const response = await donee.getDonors()
            expect(response).to.be.an('array');
          })
          it("Get current balance", async () => {
            const response = Number(await donee.getCurrentBalance())
            expect(response).to.be.an('number').equal(0)
          })
      })
      describe("Write", () => {
        describe("Donate", async () => {
          it("Updates the amount funded data structure",async () => {
            await donee.donate({ value: sendValue })
            const response = await donee.s_addressToAmountDonated(
              deployer
            )
            expect(response.toString()).to.be.equal(sendValue.toString())
          })
          it("Adds funder to array of funders", async () => {
            await donee.donate({ value: sendValue })
            const response = await donee.getDonor(0)
            expect(response).to.be.equal(deployer)
          })
          it("Check if contract emit's", async () => {
            await expect(donee.donate({ value: sendValue })).to.emit(donee, "donation")
          })
          it("Fails if you don't send enough ETH", async () => {
            await expect(await donee.donate()).to.be
            .revertedWithCustomError(donee,"InsufficientBalance")
            .withArgs(1e18);
          }).skip()
        })
        describe("Withdraw", async () => {
          beforeEach(async () => {
              await donee.donate({ value: sendValue })
          })
          it("withdraws ETH from a single funder", async () => {
            const startingDoneeBalance =
                await donee.provider.getBalance(donee.address)
            const startingDeployerBalance =
                await donee.provider.getBalance(deployer)

            const transactionResponse = await donee.withdraw()
            const transactionReceipt = await transactionResponse.wait()
            const { gasUsed, effectiveGasPrice } = transactionReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice)

            const endingFundMeBalance = await donee.provider.getBalance(
                donee.address
            )
            const endingDeployerBalance = await donee.provider.getBalance(deployer)

            expect(endingFundMeBalance).to.be.equal(0);
            expect(startingDoneeBalance
              .add(startingDeployerBalance)
              .toString())
              .to.be.equal(
                endingDeployerBalance
                .add(gasCost)
                .toString()
                )
          })
          it("is allows us to withdraw with multiple funders", async () => {
            // Arrange
            const accounts = await ethers.getSigners()
            for (i = 1; i < 6; i++) {
                const fundMeConnectedContract = await donee.connect(
                    accounts[i]
                )
                await fundMeConnectedContract.donate({ value: sendValue })
            }
            const startingFundMeBalance =
                await donee.provider.getBalance(donee.address)
            const startingDeployerBalance =
                await donee.provider.getBalance(deployer)

            // Act
            const transactionResponse = await donee.withdraw()
            const transactionReceipt = await transactionResponse.wait()
            const { gasUsed, effectiveGasPrice } = transactionReceipt
            const withdrawGasCost = gasUsed.mul(effectiveGasPrice)
            console.log(`GasCost: ${withdrawGasCost}`)
            console.log(`GasUsed: ${gasUsed}`)
            console.log(`GasPrice: ${effectiveGasPrice}`)
            const endingFundMeBalance = await donee.provider.getBalance(
              donee.address
            )
            const endingDeployerBalance =
                await donee.provider.getBalance(deployer)
            // Assert
            expect(
              startingFundMeBalance
              .add(startingDeployerBalance)
              .toString()).
              to.
              be.
              equal(endingDeployerBalance.add(withdrawGasCost).toString())
            // Make a getter for storage variables
            await expect(donee.getDonor(0)).to.be.reverted

            for (i = 1; i < 6; i++) {
              expect(
                await donee.s_addressToAmountDonated(
                  accounts[i].address
              ),
              ).to.be.equal(0)
            }
        })
          it("Only allows the owner to withdraw", async function () {
            const accounts = await ethers.getSigners()
            const doneeConnectedContract = await donee.connect(
                accounts[1]
            )
            await expect(
            await doneeConnectedContract.withdraw()
            ).to.be.revertedWithCustomError(donee,"FundMe__NotOwner()")
          }).skip()
          
        })
        describe("Others", async () => {
          it("Change minimun USD", async () => {
            const newAmount = 30;
            await donee.changeMinimunUsd(30)
            const response = Number(await donee.getMinimunUsd())/1e18
            expect(response).to.be.equal(newAmount);
          })
        })
      })
})