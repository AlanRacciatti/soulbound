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
    sbdToken = await sbdTokenFactory.deploy('https://google.com', ['https://facebook.com', 'https://instagram.com', 'https://tiktok.com']);
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
    let amount: number = 500;

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
});
