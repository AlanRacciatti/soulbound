// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

contract SBDToken is ERC721, ERC721URIStorage, Ownable {
  using Counters for Counters.Counter;

  Counters.Counter private _tokenIdCounter;
  string private _initialUri;
  string private _boughtUri;

  constructor(string memory initialUri, string memory boughtUri) ERC721('Soulbound', 'SBD') {
    _initialUri = initialUri;
    _boughtUri = boughtUri;
  }

  function safeMint(uint256 n) external onlyOwner {
    for (uint256 i = 0; i < n; i++) {
      uint256 tokenId = _tokenIdCounter.current();
      _tokenIdCounter.increment();
      _safeMint(msg.sender, tokenId);
      _setTokenURI(tokenId, _initialUri);
    }
  }

  /**
   * @notice Runs before any ERC721 transfer method
   * @dev The require statement in line 39 makes it a soulbound token once it is bought (or transferred by the owner to other address)
   * @dev (tokenId % 3) + 1 is used to get a number between 1 and 3, which correspond to the NFT metadata after transferring it
   **/
  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal virtual override {
    require(from == address(0) || from == owner(), 'Err: token transfer is BLOCKED');

    if (from == owner()) {
      _setTokenURI(tokenId, string(abi.encodePacked(_boughtUri, Strings.toString((tokenId % 3) + 1), '.json')));
    }

    super._beforeTokenTransfer(from, to, tokenId);
  }

  // The following functions are overrides required by Solidity.

  function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    super._burn(tokenId);
  }

  function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
    return super.tokenURI(tokenId);
  }
}
