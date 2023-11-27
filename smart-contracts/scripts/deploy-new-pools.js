// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const fs = require("fs");
const { ethers } = require('hardhat');
const util = require("util")
const request = util.promisify(require("request"))

const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';

const toBytes32 = function (string) {
  return ethers.utils.formatBytes32String(string);
}
const fromBytes32 = function (string) {
  return ethers.utils.parseBytes32String(string);
}

const parseUnits = function (number, units) {
  return ethers.utils.parseUnits(number, units || 8);
}

const formatUnits = function (number, units) {
  return ethers.utils.formatUnits(number, units || 8);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function callRpc(method, params) {
  var options = {
      method: "POST",
      url: "https://rpc.ankr.com/klaytn_testnet	",
      // url: "http://localhost:1234/rpc/v0",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
          jsonrpc: "2.0",
          method: method,
          params: params,
          id: 1,
      }),
  }
  const res = await request(options)
  return JSON.parse(res.body).result
}


async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const provider = hre.ethers.provider;
  const signer = await provider.getSigner();

  const account = await signer.getAddress();
  console.log('account', account);
  console.log('Account balance', formatUnits(await provider.getBalance(account)));

  const routerAddress = '0x62b3102C68cF4C3F127221b03911cbF6B36110E4';
  const router = await (await ethers.getContractFactory("Router")).attach(routerAddress);

  const usdc = {address: '0xa0f29623DDD59b9F82317b9bE0cD9bA7de58e449'};
  console.log("usdc:", usdc.address);

  const trading = {address: '0x681D42c379d3921bCDbdaFc09Cc6fCbf6e0f6A60'};
  console.log("trading:", trading.address);


  const products = [
    {
      id: 'KLAY-USD',
      maxLeverage: 50,
      fee: 0.1,
      interest: 16,
      liquidationThreshold: 80
    }
  ];

  for (const p of products) {
    await trading.addProduct(toBytes32(p.id), [
      parseUnits(""+p.maxLeverage),
      parseInt(p.liquidationThreshold * 100),
      parseInt(p.fee * 10000),
      parseInt(p.interest * 100),
    ], { maxPriorityFeePerGas: priorityFee});
    console.log('Added product ' + p.id);
  }

  console.log("trading added")


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});