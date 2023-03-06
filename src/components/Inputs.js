import React, { useState, useEffect } from "react";
import contract from "../contracts/DealClient.json";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";
import { ethers } from "ethers";
import { AiOutlineQuestionCircle } from "react-icons/ai";
const CID = require("cids");

const contractAddress = "0xab76119E5B3863c5d297693384777d5231E0Aeb2";
const contractABI = contract.abi;

function Inputs() {
  // Initialize with some dummy working default values
  const [commP, setCommP] = useState(
    "baga6ea4seaqlnvynus6vwba7rob4tuslkutuvl6zuon46cfla4ebkxcn3yxd2ji"
  );
  const [carLink, setCarLink] = useState(
    "http://85.11.148.122:24008/screenshot.car"
  );
  const [errorMessageSubmit, setErrorMessageSubmit] = useState("");
  const [pieceSize, setPieceSize] = useState("262144");
  const [carSize, setCarSize] = useState("236445");

  const handleChangeCommP = (event) => {
    setCommP(event.target.value);
  };

  const handleChangeCarLink = (event) => {
    // validate input data here
    setCarLink(event.target.value);
  };

  const handleChangePieceSize = (event) => {
    setPieceSize(event.target.value);
  };

  const handleChangeCarSize = (event) => {
    setCarSize(event.target.value);
  };

  /*
  const handleChangeStartEpoch = (event) => {
    setStartEpoch(event.target.value);
  }

  const handleChangeEndEpoch = (event) => {
    setEndEpoch(event.target.value);
  }
  */

  const handleSubmit = async (event) => {
    // This will be handling deal proposal submission sometime in the future.
    event.preventDefault();
    // do something with the carLink value, like send it to a backend API
    console.log(commP);
    console.log(carLink);
    console.log(pieceSize);
    console.log(carSize);

    try {
      const cid = new CID(commP);
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const dealClient = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        const extraParamsV1 = [
          carLink,
          carSize,
          false, // taskArgs.skipIpniAnnounce,
          false, // taskArgs.removeUnsealedCopy
        ];
        const DealRequestStruct = [
          cid.bytes, //cidHex
          pieceSize, //taskArgs.pieceSize,
          false, //taskArgs.verifiedDeal,
          "bafk2bzacec3jst4tkh424chatp273o6rxvipfg54kphd56gaxobpcdtr2sgco", //taskArgs.label,
          520000, // startEpoch
          1555200, // endEpoch
          0, // taskArgs.storagePricePerEpoch,
          0, // taskArgs.providerCollateral,
          0, // taskArgs.clientCollateral,
          1, //taskArgs.extraParamsVersion,
          extraParamsV1,
        ];
        // console.log(await provider.getBalance("0x42c930a33280a7218bc924732d67dd84d6247af4"));
        console.log(dealClient.interface);
        const transaction = await dealClient.makeDealProposal(
          DealRequestStruct
        );
        console.log("Proposing deal...");
        const receipt = await transaction.wait();
        console.log(receipt);

        console.log("Deal proposed!");
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
      setErrorMessageSubmit(
        "Something went wrong. Please check that you have a valid carfile input and a valid commP."
      );
      return;
    }
  };

  const checkWalletIsConnected = () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    ethereum.request({ method: "eth_accounts" }).then((accounts) => {
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an account:", account);
      } else {
        console.log("No account found");
      }
    });
  };

  const connectWalletHandler = () => {
    const { ethereum } = window;
    if (!ethereum) {
      alert("Get MetaMask!");
      return;
    }
    ethereum
      .request({ method: "eth_requestAccounts" })
      .then((accounts) => {
        console.log("Connected", accounts[0]);
      })
      .catch((err) => console.log(err));
  };

  const connectWalletButton = () => {
    return (
      <button
        onClick={connectWalletHandler}
        className="cta-button connect-wallet-button"
      >
        Connect Wallet
      </button>
    );
  };

  useEffect(() => {
    checkWalletIsConnected();
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ position: "absolute", top: 10, right: 50 }}>
        {connectWalletButton()}
        {window && <div style={{ color: "green" }}> Wallet connected </div>}
      </div>
      <div>
        <div
          style={{ position: "absolute", top: 30, right: 700 }}
          data-tooltip-id="carfile-tooltip"
          data-tooltip-content=" Find a URL to your car file by going to data.fvm.dev and uploading your file (site in development). You can also go to generate-car and upload the resulting car file to web3.storage."
        >
          <AiOutlineQuestionCircle />
        </div>
        <Tooltip id="carfile-tooltip" />
      </div>
      <div>
        <div
          style={{ position: "absolute", top: 70, right: 700 }}
          data-tooltip-id="commp-tooltip"
          data-tooltip-content="This is also known as the Piece CID. You can go to data.fvm.dev and get this by uploading your file (site in development). This also can be accessed as the output of generate-car."
        >
          <AiOutlineQuestionCircle />
        </div>
        <Tooltip id="commp-tooltip" />
      </div>
      <div>
        <div
          style={{ position: "absolute", top: 110, right: 700 }}
          data-tooltip-id="piecesize-tooltip"
          data-tooltip-content="This is the number of bytes of your Piece (you can read more about Filecoin Pieces in the spec). You can go to data.fvm.dev and get this by uploading your file (site in development). This also can be accessed as the output of generate-car."
        >
          <AiOutlineQuestionCircle />
        </div>
        <Tooltip id="piecesize-tooltip" />
      </div>
      <div>
        <div
          style={{ position: "absolute", top: 155, right: 700 }}
          data-tooltip-id="carsize-tooltip"
          data-tooltip-content="This is the size of the CAR file in bytes. You can go to data.fvm.dev and get this by uploading your file (site in development). This also can be accessed by running curl -I <URL to CAR file> on your command line."
        >
          <AiOutlineQuestionCircle />
        </div>
        <Tooltip id="carsize-tooltip" />
      </div>
      <form onSubmit={handleSubmit}>
        <label>
          Link to CAR file:
          <input
            type="text"
            value={carLink}
            onChange={handleChangeCarLink}
          />
        </label>
        <br />
        <br />
        <label>
          commP:
          <input
            type="text"
            value={commP}
            onChange={handleChangeCommP}
          />
        </label>
        <br />
        <br />
        <label>
          Piece Size:
          <input
            type="text"
            value={pieceSize}
            onChange={handleChangePieceSize}
          />
        </label>
        <br />
        <br />
        <label>
          Car Size:
          <input type="text" value={carSize} onChange={handleChangeCarSize} />
        </label>
        <br />
        <br />
        <button
          type="submit"
          style={{ display: "block", width: "50%", margin: "auto" }}
        >
          Submit
        </button>
        <div style={{ color: "red" }}> {errorMessageSubmit} </div>
      </form>
    </div>
  );
}

export default Inputs;
