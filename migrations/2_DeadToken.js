const DeadToken = artifacts.require("DeadToken");

module.exports = function (deployer) {
  deployer.deploy(DeadToken, 1000000000, {
    from: "0x76Aac3aE631143a0B7a9d9ad274c764034cD7635",
  });
};
