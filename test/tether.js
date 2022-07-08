await Tether.deployed()
  .then((teth) =>
    teth.transfer(
      "0x350F39e9A91967600C794f8ebb32379D60b3C0ac", //tai khoan ropsten2
      "100000000000000000000"
    )
  )
  .then((a) => console.log("result", a));
