const Contract = require("./contract.js");
const Web3 = require("web3");
const provider = new Web3.providers.HttpProvider(process.env.ETH_ENDPOINT, 60);
const Client = new Web3(provider);

const privateKey = process.env.ETH_PRIVATE_KEY;
const account = Client.eth.accounts.privateKeyToAccount(privateKey);
const contractInstance = new Client.eth.Contract(
  Contract.ABI,
  Contract.contractAddress
);
Client.eth.accounts.wallet.add(account.privateKey);
Client.eth.defaultAccount = account.address;
let chainId = 0;
Client.eth.net.getId((err, id) => {
  if (err) {
    console.log("getId", err);
    return;
  }
  chainId = id;
  console.log("current networkId", id);
});

module.exports = {
  web3: Client,
  contractInstance,
  chainId
};
