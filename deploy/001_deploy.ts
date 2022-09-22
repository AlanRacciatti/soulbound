import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { getChainId, shouldVerifyContract } from '../utils/deploy';

const deployFunction: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const args = ['ipfs://QmX24rdvjNeHonXuhLirRqmppQyY5KKPApDd7Bm2Lp9HyN', 'ipfs://QmbM8Q7KqByyECd1xvXTgGSvry2SoiYjKWDMjA4UqDsoNZ/'];

  const deploy = await hre.deployments.deploy('SBDToken', {
    contract: 'solidity/contracts/SBDToken.sol:SBDToken',
    from: deployer,
    args,
    log: true,
  });

  if (await shouldVerifyContract(deploy)) {
    await hre.run('verify:verify', {
      address: deploy.address,
      constructorArguments: args,
    });
  }
};
deployFunction.dependencies = [];
deployFunction.tags = ['SBDToken'];
export default deployFunction;
