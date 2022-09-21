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
  string[3] private _boughtUris;

  constructor(string memory initialUri, string[3] memory boughtUris) ERC721('Soulbound', 'SBD') {
    _initialUri = initialUri;
    _boughtUris = boughtUris;
  }

  function safeMint(uint256 n) external onlyOwner {
    for (uint256 i = 0; i < n; i++) {
      uint256 tokenId = _tokenIdCounter.current();
      _tokenIdCounter.increment();
      _safeMint(msg.sender, tokenId);
      _setTokenURI(tokenId, string(abi.encodePacked(_initialUri, Strings.toString(tokenId))));
    }
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal virtual override {
    require(from == address(0) || from == owner(), 'Err: token transfer is BLOCKED');

    if (from == owner()) {
      _setTokenURI(tokenId, string(abi.encodePacked(_boughtUris[tokenId % 3], Strings.toString(tokenId))));
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
