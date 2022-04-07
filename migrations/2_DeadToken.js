const DeadToken = artifacts.require("DeadToken");
const TokenSale = artifacts.require("TokenSale");

module.exports = async (deployer) => {
  await deployer.deploy(DeadToken, 1000000000, {
    from: "0x8Cb1E2f639A9E8f4870152bd49Ee921B1E0b3C09",
  });
  await deployer.deploy(
    TokenSale,
    DeadToken.address,
    1000000000000000,
    "0xc486BF401b47D6E4C6f5C9b60a408d870cDf3CA8",
    {from: "0x8Cb1E2f639A9E8f4870152bd49Ee921B1E0b3C09"}
  );
};
