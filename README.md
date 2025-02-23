Here’s your project documentation in Markdown format:

# Project Overview

This repository demonstrates a decentralized setup bridging a web-based interface and various on-chain/off-chain processes. It is built on **Hardhat** for the Solidity smart contract, an **Node.js** backend acting as an oracle, and a **React** frontend for user interaction.

## Prerequisites

- **Node.js** and **npm**
- **MetaMask** or another Ethereum-compatible wallet
- A local or remote **Ethereum node** (e.g., Hardhat node)

## Repository Structure

- **`hardhat.config.ts`** – Hardhat configuration for compiling, deploying, and testing.
- **`contracts/CustomOracleAPI.sol`** – Main Solidity contract (`CustomOracleAPI`) for handling API requests.
- **`test/CustomOracleAPI.ts`** – Hardhat tests verifying contract functionality.
- **`scripts/deploy.ts`** – Script to deploy the contract using Hardhat.
- **`scripts/invokeLocalContract.ts`** – Example script to invoke contract methods locally.
- **`backend/oracle.ts`** – Node.js oracle that listens for `APICallRequested` events and fulfills them.
- **`frontend/`** – React application with `src/App.tsx` for interacting with the contract.

## Installation & Usage

### Install dependencies

```sh
npm install
```

### Build and compile the contracts

```sh
npx hardhat compile
```

### Run tests

```sh
npx hardhat test
```

### Start a local Hardhat node

```sh
npx hardhat node
```

### Deploy the contract to the local network

```sh
npx hardhat run scripts/deploy.ts --network localhost
```

### Start the oracle server

```sh
node backend/oracle.ts
```

### Run the frontend application

Navigate to the frontend directory and start the UI:

```sh
cd frontend
npm install
npm start
```

## Smart Contract Interaction

- Use the **React** interface (`src/App.tsx`) to trigger API requests and read-only mode actions.
- The contract logs an event that the **oracle** (`backend/oracle.ts`) listens to, makes an API call, and returns the result **on-chain**.
