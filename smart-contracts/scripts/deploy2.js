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
      url: "https://rpc.ankr.com/klaytn_testnet",
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
  const priorityFee = await callRpc("eth_maxPriorityFeePerGas")

  /*
  await hre.ethers.provider.send('hardhat_setNonce', [
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    "0x3b"
  ]);
  return;
  */

  // // Local
  const darkOracleAddress = '0x0f4Ed929a87ab43787cd079A4d0374e9ffc6d47d';

  const account = await signer.getAddress();
  console.log('account', account);
  console.log('Account balance', formatUnits(await provider.getBalance(account)));

  const routerAddress = "0xAe467A4CfCe5310C50E2b2A1ad30768A02155fAC";
  const Router = await hre.ethers.getContractFactory("Router");
  const router = Router.attach(routerAddress);

  const tradingAddress = "0x24c23a634dC1dD033Dc2B2063bc689BD35BE610f";
  const Trading = await hre.ethers.getContractFactory("Trading");
  const trading = Trading.attach(tradingAddress);

  const oracleAddress = "0xB11011307e0F3c805387c10aa69F874244b1bec3";
  const Oracle = await hre.ethers.getContractFactory("Oracle");
  const oracle = Oracle.attach(oracleAddress);

  const treasuryAddress = "0x804BCb3B87F93Ec42B672cda3f88A1978d6e884F";
  const Treasury = await hre.ethers.getContractFactory("Treasury");
  const treasury = Treasury.attach(treasuryAddress);

  const ANDAddress = "0x16de95d9199Fceb3546565909eB52a4726B14311";
  const MockToken = await hre.ethers.getContractFactory("MockToken");
  const AND = MockToken.attach(ANDAddress);

  const usdcAddress = "0x3bBF3EaacC44b3ed11c1713D439aFC5f105871a5";
  const usdc = MockToken.attach(usdcAddress);

  const poolANDAddress = "0x58c7df5c9fD02EB77f617Ea4aE511612Dd85ce94";
  const PoolAND = await hre.ethers.getContractFactory("PoolCAP");
  const poolAND = PoolAND.attach(poolANDAddress);

  const poolETHAddress = "0xa09861C51676CF0fB34b22F8e0199A507D8a26EA";
  const Pool = await hre.ethers.getContractFactory("Pool");
  const poolETH = Pool.attach(poolETHAddress);

  const poolUSDCAddress = "0xD0a999DB766c1a41Db113f725a851eb3ea6A2b3a";
  const poolUSDC = Pool.attach(poolUSDCAddress);

  const poolRewardsETHAddress = "0x1fC0d18d6045DCBD44933889496d5cf5F5360010";
  const Rewards = await hre.ethers.getContractFactory("Rewards");
  const poolRewardsETH = Rewards.attach(poolRewardsETHAddress);

  const poolRewardsUSDCAddress = "0x7771117a5171B643C0aDaEfa863703ac929c2Ccf";
  const poolRewardsUSDC = Rewards.attach(poolRewardsUSDCAddress);

  const ANDRewardsETHAddress = "0xA20aa0968C555cf984B52D530586108856a0A134";
  const ANDRewardsETH = Rewards.attach(ANDRewardsETHAddress);

  const ANDRewardsUSDCAddress = "0x532C88424404a10A41A1a3bbD6016Aa0b27c909D";
  const ANDRewardsUSDC = Rewards.attach(ANDRewardsUSDCAddress);

  console.log("setting pools");
  
  const currentNonce = await provider.getTransactionCount(account);
  let nonce = currentNonce;
  console.log("Current Nonce: ", currentNonce);

  await router.setPool(ADDRESS_ZERO, poolETH.address , { maxPriorityFeePerGas: priorityFee, nonce: nonce++});
  await router.setPool(usdc.address, poolUSDC.address, { maxPriorityFeePerGas: priorityFee, nonce: nonce++});

  // Fee share setup
  await router.setPoolShare(ADDRESS_ZERO, 5000, { maxPriorityFeePerGas: priorityFee, nonce: nonce++});
  await router.setPoolShare(usdc.address, 5000, { maxPriorityFeePerGas: priorityFee, nonce: nonce++});
  console.log("set pool shares");

  console.log("set AND shares");
  await router.setANDShare(ADDRESS_ZERO, 1000, { maxPriorityFeePerGas: priorityFee, nonce: nonce++});
  await router.setANDShare(usdc.address, 1000, { maxPriorityFeePerGas: priorityFee, nonce: nonce++});
  
 
  console.log("Current Nonce: ", currentNonce);

  console.log("set Pool Rewards");
  await router.setPoolRewards(ADDRESS_ZERO, poolRewardsETH.address, { maxPriorityFeePerGas: priorityFee, nonce: nonce++});
  await router.setPoolRewards(usdc.address, poolRewardsUSDC.address, { maxPriorityFeePerGas: priorityFee, nonce: nonce++});

  const currentNonce1 = await provider.getTransactionCount(account);
  console.log("Current Nonce: ", currentNonce1);

  console.log("set And Rewards");
  await router.setANDRewards(ADDRESS_ZERO, ANDRewardsETH.address, { maxPriorityFeePerGas: priorityFee, nonce: nonce++});
  await router.setANDRewards(usdc.address, ANDRewardsUSDC.address, { maxPriorityFeePerGas: priorityFee, nonce: nonce++});

  const currentNonce2 = await provider.getTransactionCount(account);
  console.log("Current Nonce: ", currentNonce2);
  
  console.log("Setup router contracts");

  await router.setCurrencies([ADDRESS_ZERO, usdc.address], { maxPriorityFeePerGas: priorityFee, nonce: nonce++});
  console.log("Setup router currencies");

  // Link contracts with Router, which also sets their dependent contract addresses
  
// const currentNonce = await provider.getTransactionCount(account);
// let nonce = currentNonce;

  console.log("Linking with router");
  // await trading.setRouter(router.address, { maxPriorityFeePerGas: priorityFee});
  // await treasury.setRouter(router.address, { maxPriorityFeePerGas: priorityFee});
  await poolAND.setRouter(router.address, { maxPriorityFeePerGas: priorityFee, nonce: nonce++});
  await oracle.setRouter(router.address, { maxPriorityFeePerGas: priorityFee, nonce: nonce++});
  await poolETH.setRouter(router.address, { maxPriorityFeePerGas: priorityFee, nonce: nonce++});
  await poolUSDC.setRouter(router.address, { maxPriorityFeePerGas: priorityFee, nonce: nonce++});
  await poolRewardsETH.setRouter(router.address, { maxPriorityFeePerGas: priorityFee, nonce: nonce++});
  await poolRewardsUSDC.setRouter(router.address, { maxPriorityFeePerGas: priorityFee, nonce: nonce++});
  await ANDRewardsETH.setRouter(router.address, { maxPriorityFeePerGas: priorityFee, nonce: nonce++});
  await ANDRewardsUSDC.setRouter(router.address, { maxPriorityFeePerGas: priorityFee, nonce: nonce++});

  console.log("Linked router with contracts");

  const network = hre.network.name;
  console.log('network', network);

  // Add products

  const products = [
    {
      id: 'ETH-USD',
      maxLeverage: 50,
      fee: 0.1,
      interest: 16,
      liquidationThreshold: 80
    },
    {
      id: 'BTC-USD',
      maxLeverage: 50,
      fee: 0.1,
      interest: 16,
      liquidationThreshold: 80
    },
    {
      id: 'KLAY-USD',
      maxLeverage: 20,
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
    ], { maxPriorityFeePerGas: priorityFee, nonce: nonce++});
    console.log('Added product ' + p.id);
  }

  // Mint some AND, USDC
  await usdc.mint(parseUnits("10000000", 6), { maxPriorityFeePerGas: priorityFee, nonce: nonce++});
  await AND.mint(parseUnits("1000", 18), { maxPriorityFeePerGas: priorityFee, nonce: nonce++});

  fs.writeFileSync(
    "././contracts.js", `
    export const router = "${router.address}"
    export const Trading = "${trading.address}"
    export const oracle = "${oracle.address}"
    export const treasury = "${treasury.address}"
    export const AND = "${AND.address}"
    export const usdc = "${usdc.address}"
    export const PoolAND = "${poolAND.address}"
    export const poolETH = "${poolETH.address}"
    export const poolUSDC = "${poolUSDC.address}"
    export const poolRewardsETH = "${poolRewardsETH.address}"
    export const poolRewardsUSDC = "${poolRewardsUSDC.address}"
    export const ANDRewardsETH = "${ANDRewardsETH.address}"
    export const ANDRewardsUSDC = "${ANDRewardsUSDC.address}"
  
    `
  )


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


  //npx hardhat run --network fantom scripts/deploy-fantom.js 