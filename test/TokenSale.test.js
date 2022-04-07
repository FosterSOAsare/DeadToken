let TokenSale = artifacts.require("TokenSale");
let DeadToken = artifacts.require("DeadToken");

contract("TokenSale", (accounts) => {
  before(async () => {
    tokenInstance = await DeadToken.deployed();
    saleInstance = await TokenSale.deployed();
  });
  it("should return  1 billion ", async () => {
    let totalSupply = await tokenInstance.totalSupply();
    assert.equal(totalSupply, 1000000000, "It's supposed to 1 billion");
  });
  it("should return the address of the DeadToken contract ", async () => {
    let tokenContract = await saleInstance.tokenContract();
    assert.equal(
      tokenContract,
      DeadToken.address,
      "It's supposed to the address of the token smart contract"
    );
  });
  // it("should return 10000000 ", async () => {
  //   let balance = await saleInstance.balanceOf(DeadToken.contract);
  //   assert.equal(balance, 1000000, "It's supposed to be 10000000");
  // });
  // Testing the buyToken
  it("should go through  ", async () => {
    await tokenInstance.transfer(TokenSale.address, 50000000, {
      from: accounts[3],
    });
    await saleInstance.BuyToken(5000, {
      from: accounts[0],
      value: web3.utils.toWei("5", "ether"),
    });
    await saleInstance.BuyToken(10000, {
      from: accounts[5],
      value: web3.utils.toWei("10", "ether"),
    });
    let balance = await tokenInstance.balanceOf(accounts[0]);
    balance = await balance.toNumber();
    assert.equal(balance, 5000, "It should be 5000");

    let balance2 = await tokenInstance.balanceOf(accounts[3]);
    balance2 = await balance2.toNumber();
    assert.equal(balance2, 950000000, "It should be 950000000");

    let balance3 = await tokenInstance.balanceOf(TokenSale.address);
    balance3 = await balance3.toNumber();
    assert.equal(balance3, 49985000, "It should be 49985000");
  });

  // Testing endSale
  it("should return the balance of the deadtoken contract ", async () => {
    await saleInstance.endSale({from: accounts[0]});
    let balance = await tokenInstance.balanceOf(DeadToken.address);
    assert.equal(
      balance,
      0,
      "It's supposed to be 0 since remaining tokens will be transferred to owner after the ICO"
    );

    let balance2 = await tokenInstance.balanceOf(accounts[3]);
    balance2 = await balance2.toNumber();
    assert.equal(balance2, 999985000, "It should be 999985000");
  });

  it("should return 0 ", async () => {
    let balance = await tokenInstance.balanceOf(accounts[1]);
    balance = await balance.toNumber();
    assert.equal(balance, 0, "It's supposed to be 0");
  });
  // Testing the self destruct
  it("should return 0 ", async () => {
    try {
      let balance = await saleInstance.tokenPrice();
      balance = await balance.toNumber();
      assert.equal(balance, 0, "It's supposed to be 0");
    } catch (error) {
      return error;
    }
  });
});
