import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    hardhat: {
      chainId: 31337, // Default Hardhat network chain ID
    },
    localhost: {
      url: "http://127.0.0.1:8545", // Local Hardhat network
      chainId: 31337,
    },
    sepolia: {
      url: process.env.PROVIDER_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
};

export default config;
