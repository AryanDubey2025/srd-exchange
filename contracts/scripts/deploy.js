const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  const USDT_ADDRESS = "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd"; // BSC Testnet USDT
  
  console.log("Deploying P2PTrading contract...");
  
  const P2PTrading = await hre.ethers.getContractFactory("P2PTrading");
  const p2pTrading = await P2PTrading.deploy(USDT_ADDRESS);
  
  await p2pTrading.waitForDeployment();
  
  const contractAddress = await p2pTrading.getAddress();
  console.log("P2PTrading deployed to:", contractAddress);
  
  // Save contract info for frontend
  const contractInfo = {
    address: contractAddress,
    abi: JSON.parse(p2pTrading.interface.formatJson())
  };
  
  const contractInfoPath = path.join(__dirname, '../../main_app/contract-info.json');
  fs.writeFileSync(contractInfoPath, JSON.stringify(contractInfo, null, 2));
  console.log("Contract info saved to main_app/contract-info.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
