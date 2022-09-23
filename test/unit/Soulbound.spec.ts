import chai, { expect } from 'chai';
import { takeSnapshot, SnapshotRestorer } from '@nomicfoundation/hardhat-network-helpers';
import { MockContract, MockContractFactory, smock } from '@defi-wonderland/smock';
import { SBDToken, SBDToken__factory } from '@typechained';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ethers } from 'hardhat';

chai.use(smock.matchers);

describe('SBDToken', () => {
  let sbdToken: MockContract<SBDToken>,
    sbdTokenFactory: MockContractFactory<SBDToken__factory>,
    snapshot: SnapshotRestorer,
    deployer: SignerWithAddress,
    alice: SignerWithAddress,
    bob: SignerWithAddress;

  before(async () => {
    sbdTokenFactory = await smock.mock<SBDToken__factory>('SBDToken');
    sbdToken = await sbdTokenFactory.deploy(
      'ipfs://QmX24rdvjNeHonXuhLirRqmppQyY5KKPApDd7Bm2Lp9HyN',
      'ipfs://QmbM8Q7KqByyECd1xvXTgGSvry2SoiYjKWDMjA4UqDsoNZ/'
    );
    snapshot = await takeSnapshot();

    [deployer, alice, bob] = await ethers.getSigners();
  });

  beforeEach(async () => {
    await snapshot.restore();
  });

  it("Should be able to mint NFT's", async () => {
    let amount: number = 1;

    await sbdToken.connect(deployer).safeMint(amount);
    expect(await sbdToken.balanceOf(deployer.address)).to.equal(amount);
  });

  it("Should be able to mint multiple NFT's", async () => {
    let amount: number = 300;

    await sbdToken.connect(deployer).safeMint(amount);
    expect(await sbdToken.balanceOf(deployer.address)).to.equal(amount);
  });

  it("Should NOT be able to mint NFT's if not owner", async () => {
    let amount: number = 1,
      errorMessage: string = 'Ownable: caller is not the owner';

    await expect(sbdToken.connect(alice).safeMint(amount)).to.be.revertedWith(errorMessage);
  });

  it('Should NOT be able to be transferred if not owner', async () => {
    let amount: number = 1,
      tokenId: number = 0,
      errorMessage: string = 'Err: token transfer is BLOCKED';

    await sbdToken.connect(deployer).safeMint(amount);
    await sbdToken.connect(deployer).transferFrom(deployer.address, alice.address, tokenId);

    await expect(sbdToken.connect(alice).transferFrom(alice.address, bob.address, tokenId)).to.be.revertedWith(errorMessage);
  });

  it('Should be able to transfer ownership', async () => {
    const amount: number = 1;

    await sbdToken.connect(deployer).transferOwnership(alice.address);
    await expect(sbdToken.connect(deployer).safeMint(amount)).to.be.revertedWith('Ownable: caller is not the owner');
    await sbdToken.connect(alice).safeMint(amount);
    expect(await sbdToken.balanceOf(alice.address)).to.equal(amount);
  });
});
