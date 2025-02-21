// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CustomOracleAPI {
    event APICallRequested(
        uint256 requestId,
        string method,
        string apiEndpoint,
        string parameters
    );

    event APIResponseReceived(uint256 requestId, string response);

    struct APIRequest {
        address requester;
        string method;
        string apiEndpoint;
        string parameters;
        string response;
        bool fulfilled;
    }

    mapping(uint256 => APIRequest) public requests;
    uint256 public requestCounter;

    function requestAPI(
        string memory method,
        string memory apiEndpoint,
        string memory parameters
    ) public {
        requestCounter++;
        requests[requestCounter] = APIRequest(
            msg.sender,
            method,
            apiEndpoint,
            parameters,
            "",
            false
        );
        emit APICallRequested(requestCounter, method, apiEndpoint, parameters);
    }

    function triggerStartReadOnlyMode(string memory configurationId) public {
        requestCounter++;

        // Construct the JSON string with dynamic configurationId
        string memory parameters = string(
            abi.encodePacked(
                '{"params":{"configuration_id":',
                configurationId,
                "}}"
            )
        );

        requests[requestCounter] = APIRequest(
            msg.sender,
            "POST",
            "api/v2/read-only-mode/start/sqlserver",
            parameters,
            "",
            false
        );

        emit APICallRequested(
            requestCounter,
            "POST",
            "api/v2/read-only-mode/start/sqlserver",
            parameters
        );
    }

    function triggerExitReadOnlyMode(string memory configurationId) public {
        requestCounter++;

        // Construct the JSON string with dynamic configurationId
        string memory parameters = string(
            abi.encodePacked(
                '{"params":{"configuration_id":',
                configurationId,
                "}}"
            )
        );

        requests[requestCounter] = APIRequest(
            msg.sender,
            "POST",
            "api/v2/read-only-mode/exit/sqlserver",
            parameters,
            "",
            false
        );

        emit APICallRequested(
            requestCounter,
            "POST",
            "api/v2/read-only-mode/exit/sqlserver",
            parameters
        );
    }

    function fulfillAPIRequest(
        uint256 requestId,
        string memory response
    ) public {
        require(!requests[requestId].fulfilled, "Already fulfilled");
        requests[requestId].response = response;
        requests[requestId].fulfilled = true;
        emit APIResponseReceived(requestId, response);
    }

    function getAPIResponse(
        uint256 requestId
    ) public view returns (string memory) {
        require(requests[requestId].fulfilled, "No response yet");
        return requests[requestId].response;
    }
}
