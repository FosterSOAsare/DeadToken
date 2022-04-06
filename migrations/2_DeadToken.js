const DeadToken = artifacts.require("DeadToken");
const TokenSale = artifacts.require("TokenSale");

module.exports = async (deployer) => {
  await deployer.deploy(DeadToken, 1000000000, {
    from: "0x76Aac3aE631143a0B7a9d9ad274c764034cD7635",
  });
  deployer.deploy(TokenSale, DeadToken.address, 1000000000000000);
};
