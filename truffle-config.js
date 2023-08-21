const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic = "custom update chuckle find ivory sense drink arrest burden grid saddle bread";
const infuraID = "f84a400bb4bc4157bce382f7ed45e199";

module.exports = {
  contracts_build_directory: "./public/contracts",
  networks: {
    development: {
     host: "127.0.0.1",
     port: 7545,
     network_id: "*",
    },
    sepolia: {
      provider: () => new HDWalletProvider(mnemonic, `https://sepolia.infura.io/v3/${infuraID}`),
      network_id: 11155111,
    }
  },
  compilers: {
    solc: {
      version: "0.8.13",
    }
  }
};
