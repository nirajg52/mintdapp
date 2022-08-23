//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "erc721a/contracts/ERC721A.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract WOAWOA is Ownable, ERC721A {
    uint256 public constant MAX_SUPPLY = 3333;
    uint256 public price = 0.001 ether;
    uint256 public constant MAX_PER_TXN = 20;
    string public baseURI;
    bool public paused = true;

    mapping(address => uint256) public mintsPerAddress;

    constructor() ERC721A("WOAWOA", "woa") {}

    /* private function */

    function _startTokenId() internal view virtual override returns (uint256) {
        return 1;
    }

    /* public function */

    function AddresstoMint(uint256 quantity, address reciever)
        public
        payable
        onlyOwner
    {
        _safeMint(reciever, quantity);
    }

    function publicMint(uint256 quantity) external payable {
        require(!paused, "Contract is paused");
        require(
            totalSupply() + quantity <= MAX_SUPPLY,
            "Not enough mints left"
        );

        require(quantity <= MAX_PER_TXN, "Quantity too high");

        if (totalSupply() <= 1000) {
            require(msg.value == 0, "this phase is free");
        }

        if (totalSupply() > 1000) {
            require(
                msg.value >= quantity * price,
                "not enough ethers, 0.001 ETH each"
            );
        }

        mintsPerAddress[msg.sender] += quantity;

        _safeMint(msg.sender, quantity);
    }

    /* view function */

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        return
            string(
                abi.encodePacked(baseURI, Strings.toString(_tokenId), ".json")
            );
    }

    /* owner function */

    function setBaseURI(string memory _baseUri) public onlyOwner {
        baseURI = _baseUri;
    }

    function setPaused(bool _state) public onlyOwner {
        paused = _state;
    }

    function withdraw() external payable onlyOwner {
        (bool succ, ) = payable(msg.sender).call{value: address(this).balance}(
            ""
        );
        require(succ, "Owner transfer failed");
    }
}
