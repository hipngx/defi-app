require("babel-register");
require("babel-polyfill");
import "dotenv/config";
const HDWalletProvider = require("truffle-hdwallet-provider");
MNENOMIC = process.env.MNENOMIC; // Thay ABC bằng seed word của account bạn muốn dùng vào đây.
INFURA_API_KEY = process.env.INFURA_API_KEY; // Thay 123 bằng API KEY của Infura vào đây
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Match any network id
    },
    ropsten: {
      provider: () =>
        new HDWalletProvider(
          MNENOMIC,
          "https://ropsten.infura.io/v3/" + INFURA_API_KEY,
          1
        ),
      network_id: 3,
      //gas: 470000,
      gas: 29000000,
      gasPrice: 21,
    },
  },
  contracts_directory: "./src/contracts/",
  contracts_build_directory: "./src/truffle_abis/",
  compilers: {
    solc: {
      version: "^0.5.0",
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
