import { ethers } from "hardhat";
import { expect } from "chai";
import { CustomOracleAPI } from "../typechain-types";

describe("CustomOracleAPI", function () {
  let contract: CustomOracleAPI;
  let owner: any;
  let user: any;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory("CustomOracleAPI");
    contract = await Contract.deploy();
    await contract.waitForDeployment();
  });

  it("should emit APICallRequested event when requestAPI is called", async function () {
    await expect(contract.connect(user).requestAPI("POST", "http://example.com", "{}"))
      .to.emit(contract, "APICallRequested")
      .withArgs(1, "POST", "http://example.com", "{}");
  });

  it("should store API request details correctly", async function () {
    await contract.connect(user).requestAPI("GET", "http://example.com", "{}");
    const request = await contract.requests(1);
    expect(request.requester).to.equal(user.address);
    expect(request.method).to.equal("GET");
    expect(request.apiEndpoint).to.equal("http://example.com");
    expect(request.parameters).to.equal("{}");
    expect(request.fulfilled).to.equal(false);
  });

  it("should allow fulfilling an API request", async function () {
    await contract.connect(user).requestAPI("POST", "http://example.com", "{}");
    await expect(contract.fulfillAPIRequest(1, "Success"))
      .to.emit(contract, "APIResponseReceived")
      .withArgs(1, "Success");
    
    const request = await contract.requests(1);
    expect(request.fulfilled).to.equal(true);
    expect(request.response).to.equal("Success");
  });

  it("should not allow fulfilling the same request twice", async function () {
    await contract.requestAPI("GET", "http://example.com", "{}");
    await contract.fulfillAPIRequest(1, "Success");

    await expect(contract.fulfillAPIRequest(1, "Another response")).to.be.revertedWith("Already fulfilled");
  });

  it("should return API response after fulfillment", async function () {
    await contract.requestAPI("POST", "http://example.com", "{}");
    await contract.fulfillAPIRequest(1, "Success");
    const response = await contract.getAPIResponse(1);
    expect(response).to.equal("Success");
  });

  it("should revert if getting response before fulfillment", async function () {
    await contract.requestAPI("GET", "http://example.com", "{}");
    await expect(contract.getAPIResponse(1)).to.be.revertedWith("No response yet");
  });
});
