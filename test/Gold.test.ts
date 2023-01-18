import { expect } from "chai"
import { ethers } from "hardhat"
import { Signer, Contract, ContractFactory } from "ethers"

const tokens = (n: number) => {
    return ethers.utils.parseUnits(n.toString(), "ether")
}

describe("Gold", async function () {
    let owner: Signer, user: Signer, nonUser: Signer
    let gold: Contract

    beforeEach(async () => {
        // Get signers
        ;[owner, user, nonUser] = await ethers.getSigners()
        // Deploy contract
        const Gold = await ethers.getContractFactory("Gold")
        gold = await Gold.deploy()
    })

    describe("Deployment", function () {
        it("Should deploy to a proper address", async function () {
            const contractAdd = gold.address
            expect(contractAdd).is.a.properAddress
        })

        it("Should deploy with the correct owner", async function () {
            const ownerAdd = await owner.getAddress()
            const contractOwnerAdd = await gold.getOwner()
            expect(ownerAdd).to.equal(contractOwnerAdd)
        })
        it("Should deploy with a contract balance of zero", async function () {
            const initialContractBalance = await gold.getContractBalance()
            expect(initialContractBalance).to.equal(0)
        })
    })

    describe("Purchasing shares", function () {
        it("Should start with a user balance of zero", async function () {
            const initialUserBalance = await gold.connect(user).getUserBalance()
            expect(initialUserBalance).to.equal(0)
        })
        it("Should update the user balance", async function () {
            const shareAmount = 2
            await gold.connect(user).buyShare(shareAmount, { value: tokens(shareAmount) })
            const newUserBalance = await gold.connect(user).getUserBalance()
            expect(newUserBalance).to.equal(tokens(shareAmount))
        })
        it("Should update the contract balance", async function () {
            const shareAmount = 2
            await gold.connect(user).buyShare(shareAmount, { value: tokens(shareAmount) })
            const newContractBalance = await gold.getContractBalance()
            expect(newContractBalance).to.equal(tokens(shareAmount))
        })
    })

    describe("Selling shares", function () {
        beforeEach(async function () {
            const shareAmount = 2
            await gold.connect(user).buyShare(shareAmount, { value: tokens(shareAmount) })
        })

        it("Should start with the correct user balance", async function () {
            const initialUserBalance = await gold.connect(user).getUserBalance()
            expect(initialUserBalance).to.equal(tokens(2))
        })

        it("Should start with the correct contract balance", async function () {
            const initialContractBalance = await gold.connect(user).getUserBalance()
            expect(initialContractBalance).to.equal(tokens(2))
        })

        it("Should update the user balance", async function () {
            await gold.connect(user).sellShare(2)
            const newUserBalance = await gold.connect(user).getUserBalance()
            expect(newUserBalance).to.equal(0)
        })

        it("Should update the contract balance", async function () {
            await gold.connect(user).sellShare(2)
            const newContractBalance = await gold.getContractBalance()
            expect(newContractBalance).to.equal(0)
        })
    })
})
