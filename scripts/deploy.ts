import { ethers } from "hardhat";

async function main() {
    const OracleAPI = await ethers.getContractFactory("CustomOracleAPI");
    const oracle = await OracleAPI.deploy();
    await oracle.waitForDeployment();

    console.log(`Contract deployed at: ${await oracle.getAddress()}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
