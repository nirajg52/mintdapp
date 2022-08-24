import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Link, Image } from "@chakra-ui/react";
import Twitter from "./assets/social-media-icons/twitter_32x32.png";
import Opensea from "./assets/social-media-icons/opensea.png";
import Etherscan from "./assets/social-media-icons/etherscan.png";
import Logo from "./assets/social-media-icons/logo_50x50.png";
import contractWoa from "./WOAWOA.json";
import { Alert } from "react-bootstrap";

const abi = contractWoa.abi;
const clientNetwork = 4;

const address = "0x86cBb0c1952272B6BD707FfeFB676c49E61724B6";

const MainMint = () => {
  const [accounts, setAccounts] = useState(null);
  const [mintAmount, setMintAmount] = useState(20);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [totalSupply, setTotalSupply] = useState(0);

  useEffect(() => {
    checkTotalSupply();
    checkWalletIsConnected();
  }, []);

  const checkTotalSupply = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(address, abi, signer);
    const ts = await contract.totalSupply();
    console.log("TOTAL SUPPLY", Number(ts));
    setTotalSupply(Number(ts));
  };

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      alert("Make sure you have Metamask installed and you have Main network");
      return;
    } else {
      console.log("Wallet exists! We're ready to go!");
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });
    console.log("ACCOUNT", accounts);
    if (accounts.length !== 0) {
      const account = accounts[0];
      const provider = new ethers.providers.Web3Provider(ethereum);

      const balance = await provider.getBalance(account);
      console.log("balance", ethers.utils.formatEther(balance));
      console.log("Found an authorized account: ", account);
      setAccounts(accounts);
    } else {
      console.log("No authorized account found");
    }
  };

  const connectAccount = async () => {
    console.log("IN CONNECT HANDLER");
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install Metamask!");
    }

    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Found an account! Address: ", accounts[0]);
      setAccounts(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleMint = async () => {
    const { ethereum } = window;
    const networkVersion = window.ethereum.networkVersion;

    if (ethereum) {
      if (!networkVersion || networkVersion != clientNetwork) {
        alert(
          "Make sure you have Metamask installed and you have Main network"
        );
        return;
      }
      setErrorMessage("");
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const nftContract = new ethers.Contract(address, abi, signer);

      let nftTxn = await nftContract.mint(mintAmount, {
        value: ethers.utils.parseEther("0.001" * (mintAmount - 1) + ""),
      });

      setMessage("Minting... please wait");
      await nftTxn.wait();
      if (nftTxn) {
        setErrorMessage("");
        setMessage(`Minted, go to Opensea to view it.`);
        console.log("NFT TRANSACTION ", nftTxn);
        // setShow(false);
      }
    } else {
      setErrorMessage(
        "Ethereum object does not exist or connect to the Main network"
      );
    }

    checkTotalSupply();
  };
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
        {accounts ? (
          <p>Connected</p>
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
          <p>First free then 0.001 ETH each(Max 20 per tx)</p>
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

            <button className="button" onClick={handleMint}>
              Mint now
            </button>
            <div className="mintText">
              <div className="message">
                {message && <Alert variant="primary">{message}</Alert>}
              </div>
              <div className="err">
                {errorMessage && (
                  <Alert variant="warning">{errorMessage}</Alert>
                )}
              </div>
            </div>
          </div>
          <p>
            The women of America is an homage to two of NFT culture's most
            iconic works: Cryptopunks and The Americans NFT(unaffiliated)
          </p>
        </div>

        <div className="woa-gif"></div>
      </div>
    </div>
  );
};

export default MainMint;
