import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Link, Image } from "@chakra-ui/react";
import Twitter from "./assets/social-media-icons/twitter_32x32.png";
import Opensea from "./assets/social-media-icons/opensea.png";
import Etherscan from "./assets/social-media-icons/etherscan.png";
import Logo from "./assets/social-media-icons/logo_50x50.png";
import WOAWOA from "./WOAWOA.json";
import { Alert } from "react-bootstrap";

const abi = WOAWOA.abi;
const networkId = window.ethereum.networkVersion;
console.log(networkId);

const address = "0x1f5e006b9a1aefb5E23469a9B3a3f5730C4fBa8e";

const MainMint = ({ accounts, setAccounts }) => {
  const [mintAmount, setMintAmount] = useState(20);
  const [totalSupply, setTotalSupply] = useState(0);
  const isConnected = Boolean(accounts[0]);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    checkTotalSupply();
  }, []);

  const checkTotalSupply = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(address, abi, signer);
    const ts = await contract.totalSupply();
    console.log("TOTAL SUPPLY", Number(ts));
    setTotalSupply(Number(ts));
  };

  async function connectAccount() {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      setAccounts(accounts);
    }
  }

  async function handleMoreMint() {
    if (window.ethereum & (networkId == 4)) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(address, WOAWOA.abi, signer);

      const nftTxn = await contract.publicMint(mintAmount, {
        value: ethers.utils.parseEther("0.001" * (mintAmount - 1) + ""),
      });
      setMessage("Minting... please wait");

      console.log("response:", nftTxn);
      await nftTxn.wait();
      if (nftTxn) {
        setErrorMessage("");
        setMessage(`Minted, go to Opensea to view it.`);
        console.log("NFT TRANSACTION ", nftTxn);
        // setShow(false);
      } else {
        setErrorMessage(
          "Ethereum object does not exist or connect to the Main network"
        );
      }

      console.log("response:", nftTxn);
      checkTotalSupply();
    }
  }

  const handleIncrement = () => {
    if (mintAmount >= 20) return;
    setMintAmount(mintAmount + 1);
  };

  const handleDecrement = () => {
    if (mintAmount <= 1) return;
    setMintAmount(mintAmount - 1);
  };

  return (
    <div>
      <div className="navbar">
        <div className="logo-name">
          <Image src={Logo} boxSize="50px" margin="0 30px"></Image>
          <p4 className="NameTag">The women of America</p4>
        </div>

        <div className="navbar-element1">
          <div className="navbar-element">
            <Link href="https://">
              <Image src={Etherscan} boxSize="50px" margin="0 20px"></Image>
            </Link>
          </div>

          <div className="navbar-element">
            <Link href="https://">
              <Image src={Opensea} boxSize="50px" margin="0 20px"></Image>
            </Link>
          </div>

          <div className="navbar-element">
            <Link href="https://">
              <Image src={Twitter} boxSize="50px" margin="0 20px"></Image>
            </Link>
          </div>
        </div>
        {isConnected ? (
          <p className="connectText">Connected</p>
        ) : (
          <button className="button" onClick={connectAccount}>
            Connect
          </button>
        )}
      </div>
      <div className="mintb">
        <div className="mint-box">
          <h1>The women of America</h1>
          <h2>{totalSupply}/3333</h2>
          <p>0.001 ETH each(Max 20 per tx)</p>
          <div>
            <div>
              <button className="button-plusminus" onClick={handleDecrement}>
                -
              </button>
              <input
                className="mintAmountBox"
                type="text"
                value={mintAmount}
              ></input>
              <button className="button-plusminus" onClick={handleIncrement}>
                +
              </button>
            </div>

            <button className="mintButton button" onClick={handleMoreMint}>
              Mint now
            </button>

            <div className="msgText">
              <div className="mintMessage">
                {message && <Alert variant="primary">{message}</Alert>}
              </div>
              <div className="errorMessage">
                {errorMessage && (
                  <Alert variant="warning">{errorMessage}</Alert>
                )}
              </div>
            </div>
          </div>
          <p>
            The women of America is an homage to one of NFT culture's most
            iconic works: The Americans NFT(unaffiliated)
          </p>
        </div>

        <div className="woa-gif"></div>
      </div>
    </div>
  );
};

export default MainMint;
