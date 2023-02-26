require("hardhat-deploy")
require("hardhat-deploy-ethers")

const { networkConfig } = require("../helper-hardhat-config")


const private_key = network.config.accounts[0]
const wallet = new ethers.Wallet(private_key, ethers.provider)

module.exports = async ({ deployments }) => {
    console.log("Wallet Ethereum Address:", wallet.address)
    const chainId = network.config.chainId
    const tokensToBeMinted = networkConfig[chainId]["tokensToBeMinted"]

    //deploy Simplecoin
    const CBORParse = await ethers.getContractFactory('CBORParse', wallet);
    console.log('Deploying CBORParse...');
    const cborparse = await CBORParse.deploy(tokensToBeMinted);
    await cborparse.deployed()
    console.log('CBORParse deployed to:', cborparse.address);

    //deploy FilecoinMarketConsumer
    const DealClient = await ethers.getContractFactory('DealClient', wallet);
    console.log('Deploying DealClient...');
    const dealclient = await DealClient.deploy();
    await dealclient.deployed()
    console.log('DealClient deployed to:', dealclient.address);

}