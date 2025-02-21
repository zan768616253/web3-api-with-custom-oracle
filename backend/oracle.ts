import { ethers } from "ethers";
import axios from "axios";
import dotenv from "dotenv";
import https from "https"

dotenv.config();

const BASE_URL = "https://localhost:4433"; // Define the base URL

const provider = new ethers.JsonRpcProvider(process.env.PROVIDER_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider);
const contractAddress = process.env.CONTRACT_ADDRESS as string;

const contractABI = [
  "event APICallRequested(uint256 requestId, string method, string apiEndpoint, string parameters)",
  "event APIResponseReceived(uint256 requestId, string response)",
  "function fulfillAPIRequest(uint256 requestId, string response)"
];

const contract = new ethers.Contract(contractAddress, contractABI, wallet);

const instance = axios.create({
    httpsAgent: new https.Agent({  
      rejectUnauthorized: false
    }),
    baseURL: BASE_URL,
    auth: {
        username: 'admin',
        password: 'admin'
    },
});


async function listenForEvents() {
    contract.on("APIResponseReceived", (requestId, response) => {
        console.log(`API Response Received: requestId=${requestId}, response=${response}`);
    });

    contract.on("APICallRequested", async (requestIdRaw, method, apiEndpoint, parameters) => {
        console.log(`API Request received: ID=${requestIdRaw}, Method=${method}, Endpoint=${apiEndpoint}`);

        if (!apiEndpoint.startsWith("/")) {
            apiEndpoint = `/${apiEndpoint}`;
        }

        const requestId = requestIdRaw.toString(); // Convert bigint to string        
        
        try {

            let response;
            if (method === "GET") {
                response = await instance.get(apiEndpoint);
            } else if (method === "POST") {
                response = await instance.post(apiEndpoint, JSON.parse(parameters));
            } else {
                console.error(`Unsupported method: ${method}`);
                return;
            }

            const formattedResponse = JSON.stringify(response.data);

            const tx = await contract.fulfillAPIRequest(requestId, formattedResponse);
            await tx.wait();
            console.log(`Response written to blockchain!`);
        } catch (error) {
            console.error("API call failed:", getErrorDetails(error));
            const errorResponse = JSON.stringify({ error: "API request failed" });
        
            try {
                const tx = await contract.fulfillAPIRequest(requestId, errorResponse);
                await tx.wait();
                console.log(`Error response written to blockchain.`);
            } catch (txError) {
                console.error("Failed to write error response to blockchain:", getErrorDetails(txError));
            }
        }

    });
}

function getErrorDetails(error: any): string {
    return error instanceof Error ? error.message : JSON.stringify(error);
}

listenForEvents();
console.log("Oracle is listening...");
