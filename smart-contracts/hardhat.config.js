require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require('dotenv').config()

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "hyperspace",
  networks: {
    hardhat: {
   
    },
  baobab: {
    chainId: 1001,
    url: 'https://rpc.ankr.com/klaytn_testnet',
    accounts: [process.env.PRIVATE_KEY],

  },

  },
 
  solidity: {
    compilers: [{
      version: "0.8.7",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }]
  }
};
