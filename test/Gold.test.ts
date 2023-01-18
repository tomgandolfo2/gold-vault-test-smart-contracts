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
        it("Should deploy with the correct owner", async function () {
            const ownerAdd = await owner.getAddress()
            const contractOwnerAdd = await gold.getOwner()
            expect(ownerAdd).to.equal(contractOwnerAdd)
        })
        it("Should deploy with a balance of zero", async function () {
            const initialContractBalance = await gold.getContractBalance()
            expect(initialContractBalance).to.equal(0)
        })
    })

    describe("Purchasing shares", function () {
        it("Should update the user balance", async function () {
            const shareAmount = 2
            await gold.connect(user).buyShare(shareAmount, { value: tokens(2) })
            const newUserBalance = await gold.connect(user).getUserBalance()
            expect(newUserBalance).to.equal(tokens(shareAmount))
        })
    })
})
