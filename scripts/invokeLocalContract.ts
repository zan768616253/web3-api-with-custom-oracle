import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
const privateKey = process.env.PRIVATE_KEY as string;
const wallet = new ethers.Wallet(privateKey, provider);

const contractAddress = process.env.CONTRACT_ADDRESS as string;
const contractABI = [
  "function requestAPI(string method, string apiEndpoint, string parameters) public",
  "function getAPIResponse(uint256 requestId) public view returns (string memory)"
];

const contract = new ethers.Contract(contractAddress, contractABI, wallet);

async function invokeContract() {
  try {
    console.log("Invoking Smart Contract...");

    // Call requestAPI function
    const tx = await contract.requestAPI("POST", "http://mock-api.com", "{}");
    await tx.wait();
    console.log(`API Request Sent: ${tx.hash}`);

    // Wait a few seconds to allow Oracle to process
    console.log("Waiting for Oracle to fulfill the request...");
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Fetch API response from contract
    const response = await contract.getAPIResponse(1);
    console.log(`API Response from contract: ${response}`);
  } catch (error) {
    console.error("Error invoking contract:", error);
  }
}

invokeContract();
