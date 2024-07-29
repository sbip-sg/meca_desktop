# User Guide

## Table of Contents
1. [Introduction](#Introduction)
2. [Installation](#Installation)
3. [Usage](#Usage)

## Introduction
MECA Desktop is an interactive application that allows you to join the MECA ecosystem and start hosting your compute resources straight away. The application makes it easy and intuitive to manage your resources and monitor your transactions. It is designed to be user-friendly and accessible to most operating systems, including Windows, MacOS, and Linux.

## Installation
Download the latest version of the application from the [MECA Desktop GitHub repository](https://github.com/sbip-sg/meca_desktop/releases).

You will also need to have Docker installed on your machine. You can download Docker from the [official Docker website](https://www.docker.com/get-started).
You will also need to have IPFS installed on your machine. You can download an IPFS container from the [official IPFS website](https://docs.ipfs.tech/install/run-ipfs-inside-docker/).

## Usage
To start the application, simply run the executable file that you downloaded.

### Login
You will need several pieces of personal information to log in to the application:

- Private keys from your blockchain wallet. You can use the private keys from your existing wallet like Metamask. These are used to sign transactions and interact with the MECA network.
- "HOST_ENCRYPTION_PRIVATE_KEY": This is a private key that is used for end-to-end encryption for task offloading. You can use the same key as the wallet key or generate a new key by creating a new account.

Other information that you can provide:
- IPFS HOST AND PORT: the url to the node for retrieving tasks from IPFS.
- IPFS API HOST AND PORT: the url to the node for uploading tasks to IPFS. This should be a node you have write access to.
- BLOCKCHAIN RPC URL: the url to the blockchain node where the contracts are deployed.
- DAO CONTRACT ADDRESS: the address of the DAO contract on the blockchain, which is the entrypoint to all other functions of the MECA network.
- TASK EXECUTOR URL: the url to the task executor server, which is used to execute tasks on your machine. By default `http://meca-executor-1:2591`, and there is no need to change this unless you are running a custom task executor server.

We have launched our smart contracts on the Ethereum Sepolia Testnet (address: 0x56873484BFB38789624ADeff6aF642A41246976f). You can get free testnet ETH from the [Sepolia Testnet Faucet](https://faucet.sepolia.io/) and use those accounts to interact with the MECA network.
To configure for Sepolia:
- MECA_BLOCKCHAIN_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/nf3vIJJEKzQWwbKW1UHXvw1aKAeE6B97
- MECA_DAO_CONTRACT_ADDRESS=0x56873484BFB38789624ADeff6aF642A41246976f

### Dashboard and resource sharing
![Dashboard](/_static/images/dashboard.png)
Here you can see an overview of your resources and transactions. 

On the top left, you can customize the resources to share and enable it to be connected to the MECA ecosystem. This allows you to receive tasks from the MECA network and earn rewards. Tasks will automatically execute on your machine. You will have to activate chosen tasks in the Tasks Management section and also register for a tower in the Tower Management section before you can receive any task.

### Tasks Management
![Tasks](/_static/images/tasks.png)
You can view the tasks that are available for downloading and activating. After downloading, it has to be built and tested before it can be activated. Once activated, other users will be able to send those specific tasks to your machine.

### Tower Management
![Towers](/_static/images/towers.png)
You can view the towers that are available for registration. You can register for a tower which will relay tasks from other users to your machine.
