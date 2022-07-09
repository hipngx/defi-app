const Tether = artifacts.require("Tether");
const account = "0x350F39e9A91967600C794f8ebb32379D60b3C0ac"; //acount to transfer
const amount = "100000000000000000000"; //amount, default 100

module.exports = async function transferToken(callback) {
  let tether = await Tether.deployed();
  await tether.transfer(account, amount);
  console.log("Tokens have been transfer successfully!");
  callback();
};

// truffle exec scripts/transfer-token.js --network ropsten
