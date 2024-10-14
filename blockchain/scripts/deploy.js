const { ethers } = require("hardhat");

async function main() {
  const contractfactory = await ethers.getContractFactory("MyToken");

  console.log("deploying.....");
  const MyToken = await contractfactory.deploy();
  await MyToken.waitForDeployment();
  // await SimpleStorage.deploymentTransaction();
  console.log(`deployed `);
  console.log(MyToken.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
