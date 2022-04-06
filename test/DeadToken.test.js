let DeadToken = artifacts.require("DeadToken");

contract("DeadToken", (accounts) => {
  let deployer = accounts[3];
  before(async () => {
    instance = await DeadToken.deployed();
  });
  it("should return  1 billion ", async () => {
    let totalSupply = await instance.totalSupply();
    assert.equal(totalSupply, 1000000000, "It's supposed to 1 billion");
  });
  //   Testing deployer
  it("should return accounts[3]", async () => {
    let deployer = await instance.deployer();
    assert.equal(deployer, accounts[3], "It's supposed to be accounts[0]");
  });
  //   Testing balanceOf and the constructor
  it("should give 1 billion tokens to the deployer", async () => {
    let balance = await instance.balanceOf(deployer);
    assert.equal(balance, 1000000000, "It's 1 billion tokens");
  });
  //   Testing name, symbol and decimal
  it("set all constant information", async () => {
    let name = await instance.name();
    let symbol = await instance.symbol();
    let decimal = await instance.decimal();
    assert.equal(name, "Dead Token", "Should return Dead Token");
    assert.equal(symbol, "DTK", "Should return DTK");
    assert.equal(decimal, "8", "Should return 8");
  });
  //testing the transfer functionality
  it("make all necessary changes after a transfer", async () => {
    await instance.transfer(accounts[0], 100, {from: deployer});
    let balance1 = await instance.balanceOf(deployer);
    balance1 = await balance1.toNumber();
    let balance2 = await instance.balanceOf(accounts[0]);
    balance2 = await balance2.toNumber();
    assert.equal(balance1, 999999900, "Should return 1000000000");
    assert.equal(balance2, 100, "Should return 100");
  });
  //   testing the approve functionality
  it("make all necessary changes after a approving an address ", async () => {
    await instance.approve(accounts[1], 20000, {from: accounts[3]});
    let allowance = await instance.allowance(accounts[3], accounts[1]);
    allowance = await allowance.toNumber();
    assert.equal(allowance, 20000, "It's supposed to be 20000");
  });
  //   testing the transferFrom
  it("make all necessary changes after a transfer function ", async () => {
    await instance.transferFrom(accounts[3], accounts[4], 2000, {
      from: accounts[1],
    });
    let allowance = await instance.allowance(accounts[3], accounts[1]);
    allowance = await allowance.toNumber();
    assert.equal(allowance, 18000, "It's supposed to be 20000");
    let balance1 = await instance.balanceOf(accounts[3]);
    balance1 = await balance1.toNumber();
    assert.equal(balance1, 999997900, "It's supposed to be 999997900");
    let balance2 = await instance.balanceOf(accounts[4]);
    balance2 = await balance2.toNumber();
    assert.equal(balance2, 2000, "It's supposed to be 2000");
  });
  //   Testing the freeze functionality
  it("make all necessary changes after a freeze function ", async () => {
    await instance.freeze(2000, {
      from: accounts[3],
    });
    let balance = await instance.balanceOf(accounts[3]);
    balance = await balance.toNumber();
    assert.equal(balance, 999995900, "It's supposed to be 999995900");
    let frozen = await instance.frozenTokens(accounts[3]);
    frozen = await frozen.toNumber();
    assert.equal(frozen, 2000, "It's supposed to be 2000");
  });
  //   Testing the unfreeze functionality
  it("make all necessary changes after an unfreeze function ", async () => {
    await instance.unfreeze(100, {
      from: accounts[3],
    });
    let balance = await instance.balanceOf(accounts[3]);
    balance = await balance.toNumber();
    assert.equal(balance, 999996000, "It's supposed to be 999996000");
    let frozen = await instance.frozenTokens(accounts[3]);
    frozen = await frozen.toNumber();
    assert.equal(frozen, 1900, "It's supposed to be 1900");
  });

  //   Testing the mint functionality
  it("make all necessary changes after a mint function ", async () => {
    let address = DeadToken.address;
    await instance.mintTokens(address, 1000000, {
      from: accounts[3],
    });
    let balance = await instance.balanceOf(address);
    balance = await balance.toNumber();
    assert.equal(balance, 1000000, "It's supposed to be 1000000");
    let balance2 = await instance.balanceOf(deployer);
    balance2 = await balance2.toNumber();
    assert.equal(balance2, 998996000, "It's supposed to be 998996000");
    let mintTimestamp = await instance.mintTimestamp();
    mintTimestamp = await mintTimestamp.toNumber();
    assert.notEqual(mintTimestamp, 0, "It is set to a greater blockTimestamp");
  });
});
