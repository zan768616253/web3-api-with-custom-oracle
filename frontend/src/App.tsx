import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

declare global {
  interface Window {
    ethereum: any;
  }
}

// Smart contract ABI and address
const contractABI = [
  "event APICallRequested(uint256 requestId, string method, string apiEndpoint, string parameters)",
  "event APIResponseReceived(uint256 requestId, string response)",
  "function requestAPI(string method, string apiEndpoint, string parameters) public",
  "function getAPIResponse(uint256 requestId) public view returns (string memory)",
  "function triggerStartReadOnlyMode(string configurationId) public",
  "function triggerExitReadOnlyMode(string configurationId) public",
];

const contractAddress = "0x2aC03F44034857B07eC042C841C44af595164a01";

const API_PREFIX = "/api/v2/"; // Ensure API requests always start with this

const App: React.FC = () => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [response, setResponse] = useState<string>("");

  // State variables for API requests
  const [method, setMethod] = useState<string>("POST");
  const [url, setUrl] = useState<string>(""); // Stores the user input (excluding prefix)
  const [requestBody, setRequestBody] = useState<string>("");

  // State variable for configurationId in triggerStartReadOnlyMode
  const [readOnlyConfigurationId, setReadOnlyConfigurationId] = useState<string>("");
  // State variable for configurationId in triggerExitReadOnlyMode
  const [restoreConfigurationId, setRestoreConfigurationId] = useState<string>("");

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);

      provider.send("eth_requestAccounts", []).then(async (accounts: string[]) => {
        setAccount(accounts[0]);

        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        setContract(contract);
      });
    }
  }, []);

  const requestAPI = async () => {
    if (contract) {
      try {
        const fullUrl = `${API_PREFIX}${url}`;
        const tx = await contract.requestAPI(method, fullUrl, requestBody);
        const receipt = await tx.wait();
        console.log("API Request Sent");

        // Parse logs manually to find APICallRequested event
        let requestId;
        for (const log of receipt.logs) {
            try {
            const parsedLog: any = contract.interface.parseLog(log);
            if (parsedLog.name === "APICallRequested") {
                requestId = parsedLog.args.requestId.toString();
                console.log(`API Request Sent: Request ID=${requestId}`);
                setRequestId(requestId);
                break;
            }
            } catch (error) {
            // Skip logs that can't be parsed by this interface
            continue;
            }
        }
        if (!requestId) {
            console.warn("APICallRequested event not found in logs.");
        }
      } catch (err) {
        console.error("Error requesting API:", err);
      }
    }
  };

  const triggerExitReadOnlyMode = async () => {
    if (contract && restoreConfigurationId) {
      try {
        const tx = await contract.triggerExitReadOnlyMode(restoreConfigurationId);
        const receipt = await tx.wait();
        console.log("API Request Sent");

        // Parse logs manually to find APICallRequested event
        let requestId;
        for (const log of receipt.logs) {
            try {
            const parsedLog: any = contract.interface.parseLog(log);
            if (parsedLog.name === "APICallRequested") {
                requestId = parsedLog.args.requestId.toString();
                console.log(`API Request Sent: Request ID=${requestId}`);
                setRequestId(requestId);
                break;
            }
            } catch (error) {
            // Skip logs that can't be parsed by this interface
            continue;
            }
        }
        if (!requestId) {
            console.warn("APICallRequested event not found in logs.");
        }
      } catch (err) {
        console.error("Error triggering Read-Only Mode:", err);
      }
    }
  };

  const triggerStartReadOnlyMode = async () => {
    if (contract && readOnlyConfigurationId) {
      try {
        const tx = await contract.triggerStartReadOnlyMode(readOnlyConfigurationId);
        const receipt = await tx.wait();
        console.log("API Request Sent");

        // Parse logs manually to find APICallRequested event
        let requestId;
        for (const log of receipt.logs) {
            try {
            const parsedLog: any = contract.interface.parseLog(log);
            if (parsedLog.name === "APICallRequested") {
                requestId = parsedLog.args.requestId.toString();
                console.log(`API Request Sent: Request ID=${requestId}`);
                setRequestId(requestId);
                break;
            }
            } catch (error) {
            // Skip logs that can't be parsed by this interface
            continue;
            }
        }
        if (!requestId) {
            console.warn("APICallRequested event not found in logs.");
        }
      } catch (err) {
        console.error("Error triggering Read-Only Mode:", err);
      }
    }
  };

  const getAPIResponse = async () => {
    if (contract && requestId) {
      try {
        const response = await contract.getAPIResponse(requestId);
        setResponse(response);
      } catch (err) {
        console.error("Error fetching response:", err);
        setResponse("No response yet");
      }
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">StandbyMP Web3 Bridge: Decentralized Disaster Recovery</h1>
      {account ? (
        <div className="alert alert-info">
          <p><strong>Connected Account:</strong> {account}</p>
        </div>
      ) : (
        <div className="text-center">
          <button className="btn btn-primary" onClick={() => window.ethereum.request({ method: "eth_requestAccounts" })}>
            Connect Metamask
          </button>
        </div>
      )}

      {/* Trigger Start Read-Only Mode */}
      <div className="my-4 p-3 border rounded">
        <h4>Trigger Start Read-Only Mode</h4>
        <div className="mb-3">
          <label htmlFor="configurationId" className="form-label">Configuration ID</label>
          <input
            type="text"
            id="configurationId"
            className="form-control"
            value={readOnlyConfigurationId}
            onChange={(e) => setReadOnlyConfigurationId(e.target.value)}
            placeholder="Enter Configuration ID"
          />
        </div>
        <div className="text-center">
          <button className="btn btn-warning" onClick={triggerStartReadOnlyMode} disabled={!contract || !readOnlyConfigurationId}>
            Start Read-Only Mode
          </button>
        </div>
      </div>

    {/* Trigger Start Read-Only Mode */}
    <div className="my-4 p-3 border rounded">
        <h4>Trigger Exit Read-Only Mode</h4>
        <div className="mb-3">
          <label htmlFor="configurationId" className="form-label">Configuration ID</label>
          <input
            type="text"
            id="configurationId"
            className="form-control"
            value={restoreConfigurationId}
            onChange={(e) => setRestoreConfigurationId(e.target.value)}
            placeholder="Enter Configuration ID"
          />
        </div>
        <div className="text-center">
          <button className="btn btn-warning" onClick={triggerExitReadOnlyMode} disabled={!contract || !restoreConfigurationId}>
            Exit Read-Only Mode
          </button>
        </div>
      </div>

      {/* Request API */}
      <div className="my-4 p-3 border rounded">
        <h4>Request API</h4>
        <div className="mb-3">
          <label htmlFor="method" className="form-label">HTTP Method</label>
          <select
            id="method"
            className="form-select"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="url" className="form-label">API Endpoint</label>
          <div className="input-group">
            <span className="input-group-text">/api/v2/</span>
            <input
              type="text"
              id="url"
              className="form-control"
              value={url}
              onChange={(e) => setUrl(e.target.value.replace(/^\//, ""))} // Prevent leading slashes
              placeholder="event/list"
            />
          </div>
          <small className="text-muted">Enter only the path after <code>/api/v2/</code></small>
        </div>

        <div className="mb-3">
          <label htmlFor="requestBody" className="form-label">Request Body (JSON)</label>
          <textarea
            id="requestBody"
            className="form-control"
            value={requestBody}
            onChange={(e) => setRequestBody(e.target.value)}
            placeholder='{"key": "value"}'
            rows={5}
          />
        </div>

        <div className="text-center">
          <button className="btn btn-success" onClick={requestAPI} disabled={!contract || !url || !requestBody}>
            Request API
          </button>
        </div>
      </div>

      {/* Request ID and Response */}
      {requestId && (
        <div className="my-4">
          <p><strong>Request ID:</strong> {requestId}</p>
          <div className="text-center">
            <button className="btn btn-info" onClick={getAPIResponse}>Get API Response</button>
          </div>
        </div>
      )}

      {response && (
        <div className="my-4">
          <h3>API Response</h3>
          <pre className="bg-light p-3">{response}</pre>
        </div>
      )}
    </div>
  );
};

export default App;
