import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { getChainId, shouldVerifyContract } from '../utils/deploy';

const deployFunction: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();

  const deploy = await hre.deployments.deploy('SBDToken', {
    contract: 'solidity/contracts/SBDToken.sol:SBDToken',
    from: deployer,
    log: true,
  });

  if (await shouldVerifyContract(deploy)) {
    await hre.run('verify:verify', {
      address: deploy.address,
    });
  }
};
deployFunction.dependencies = [];
deployFunction.tags = ['SBDToken'];
export default deployFunction;
