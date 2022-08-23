import { useState, useEffect } from "react";
import { ethers, BigNumber } from "ethers";
import { Link, Image } from "@chakra-ui/react";
import Twitter from "./assets/social-media-icons/facebook_32x32.png";
import Opensea from "./assets/social-media-icons/facebook_32x32.png";
import Etherscan from "./assets/social-media-icons/facebook_32x32.png";
import Logo from "./assets/social-media-icons/logo_50x50.png";
import WOAWOA from "./WOAWOA.json";

const abi = WOAWOA.abi;

const address = "0xa3D936d6C20c46d34615Bd34224dd86A16752d25";

const MainMint = ({ accounts, setAccounts }) => {
  const [mintAmount, setMintAmount] = useState(1);
  const isConnected = Boolean(accounts[0]);
  const [totalSupply, setTotalSupply] = useState(0);
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
        method: "eth_requestAccounts",
      });
      setAccounts(accounts);
    }
  }

  async function handleMint() {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(address, WOAWOA.abi, signer);
      try {
        const response = await contract.publicMint(BigNumber.from(mintAmount));
        console.log("response:", response);
      } catch (err) {
        console.log("error:", err);
      }
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
          <p4>The women of America</p4>
        </div>

        <div className="navbar-element">
          <Link href="https://">
            <Image src={Opensea} boxSize="50px" margin="0 30px"></Image>
          </Link>
        </div>

        <div className="navbar-element">
          <Link href="https://">
            <Image src={Twitter} boxSize="50px" margin="0 30px"></Image>
          </Link>
        </div>

        <div className="navbar-element">
          <Link href="https://">
            <Image src={Etherscan} boxSize="50px" margin="0 30px"></Image>
          </Link>
        </div>

        {isConnected ? (
          <p>Connected</p>
        ) : (
          <button className="button" onClick={connectAccount}>
            Connect
          </button>
        )}
      </div>
      <h1>WOAWOA</h1>
      <p>0.001 ETH each(Max 20 per tx)</p>

      <div>
        <div>
          <button onClick={handleDecrement}>-</button>
          <input type="text" value={mintAmount}></input>
          <button onClick={handleIncrement}>+</button>
        </div>

        <button onClick={handleMint}>Mint Now</button>
      </div>
    </div>
  );
};

export default MainMint;