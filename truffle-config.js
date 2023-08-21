module.exports = {
  contracts_build_directory: "./public/contracts",
  networks: {
    development: {
     host: "127.0.0.1",
     port: 7545,
     network_id: "*",
    },
    sepolia: {
      host: "https://sepolia.infura.io/v3/",
      network_id: "11155111",
    },
  },
  compilers: {
    solc: {
      version: "0.8.13",
    }
  }
};
