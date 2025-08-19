import { expect } from "chai";
import { ethers } from "hardhat";

describe("P2PTrading", function () {
  it("Should deploy successfully", async function () {
    const P2PTrading = await ethers.getContractFactory("P2PTrading");
    const p2pTrading = await P2PTrading.deploy();
    await p2pTrading.waitForDeployment();
    
    expect(await p2pTrading.getAddress()).to.be.properAddress;
  });
});