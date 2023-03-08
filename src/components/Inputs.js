import React, { useState, useEffect } from "react";
import contract from "../contracts/DealClient.json";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";
import { ethers } from "ethers";
import { AiOutlineQuestionCircle } from "react-icons/ai";
const CID = require("cids");

const contractAddress = "0xab76119E5B3863c5d297693384777d5231E0Aeb2";
const contractABI = contract.abi;
let dealClient;
let cid;

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
  const [txSubmitted, setTxSubmitted] = useState("");
  const [dealID, setDealID] = useState("");

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
      cid = new CID(commP);
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        dealClient = new ethers.Contract(
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
          "", //taskArgs.label,
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
        setTxSubmitted("Transaction submitted! " + receipt.hash);

        console.log("Deal proposed! CID: " + cid);
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

  const dealIDButton = () => {
    return (
      <button
        onClick={dealIDHandler}
      >
        Get deal ID
      </button>
    );
  };

  const dealIDHandler = async () => {
    setInterval(async () => {
        setDealID("Loading");
        console.log(cid);
        console.log("Checking for deal ID...");
        const transaction = await dealClient.pieceDeals(cid.bytes);
        console.log(transaction);
        if (transaction !== undefined && typeof(transaction) === "number") {
          setDealID(transaction);
          console.log(transaction);
          return;
        }
      }, 5000
    );
  };

  useEffect(() => {
    checkWalletIsConnected();
  }, []);

  return (
    <div id="container"> 
      <div style={{ display: "flex" }}> <div class="child-1-cw"> 
        {connectWalletButton()}
        {window && <div style={{ color: "green" }}> Connected: Hyperspace </div>}
      </div></div>

      <form class="child-1"  onSubmit={handleSubmit}>

        <div class='child-1-hg'>

        <label>
          Link to CAR file
        </label>


        <div>
          <div class="tooltip"
            data-tooltip-id="carfile-tooltip"
            data-tooltip-delay-hide={50}
            data-tooltip-html=" Find a URL to your car file by going to data.fvm.dev and uploading your file (site in development). <br /> You can also go to tech-greedy/generate-car and upload the resulting car file to web3.storage."
          >
            <AiOutlineQuestionCircle />
          </div>
          <Tooltip id="carfile-tooltip" />
        </div>


        </div>


          <input class="input-elem"
            type="text"
            value={carLink}
            onChange={handleChangeCarLink}
          />
        
        <br />
        <br />

        <div class='child-1-hg'>

        <label> commP </label>

            <div
              class="tooltip"
              data-tooltip-id="commp-tooltip"
              data-tooltip-delay-hide={50}
              data-tooltip-html="This is also known as the Piece CID. <br /> You can go to data.fvm.dev and get this by uploading your file (site in development). <br />This also can be accessed as the output of tech-greedy/generate-car."
            >
              <AiOutlineQuestionCircle />
            </div>
            <Tooltip id="commp-tooltip" />

        </div>

          <input class="input-elem"
            type="text"
            value={commP}
            onChange={handleChangeCommP}
          />


        <br />
        <br />

        <div class='child-1-hg'>

        <label>
          Piece Size:
        </label>

        <div
          class="tooltip"
          data-tooltip-id="piecesize-tooltip"
          data-tooltip-delay-hide={50}
          data-tooltip-html="This is the number of bytes of your Piece (you can read more about Filecoin Pieces in the spec). <br /> You can go to data.fvm.dev and get this by uploading your file (site in development).<br /> This also can be accessed as the output of tech-greedy/generate-car."
        >
          <AiOutlineQuestionCircle />
        </div>
        <Tooltip id="piecesize-tooltip" />


        </div>

          <input class="input-elem"
            type="text"
            value={pieceSize}
            onChange={handleChangePieceSize}
          />
        <br />
        <br />

        <div class='child-1-hg'>

        <label>
          Car Size:
        </label>

        <div
          class="tooltip"
          data-tooltip-id="carsize-tooltip"
          data-tooltip-delay-hide={50}
          data-tooltip-html="This is the size of the CAR file in bytes. <br /> You can go to data.fvm.dev and get this by uploading your file (site in development). <br /> This also can be accessed by running curl -I <URL to CAR file> on your command line."
        >
          <AiOutlineQuestionCircle />
        </div>
        <Tooltip id="carsize-tooltip" />


        </div>

          <input class="input-elem" type="text" value={carSize} onChange={handleChangeCarSize} />
        <br />
        <br />
        <button
          type="submit"
          style={{ display: "block", width: "50%", margin: "auto" }}
        >
          Submit
        </button>
        <div style={{ color: "red" }}> {errorMessageSubmit} </div>
        <div style={{ color: "green" }}> {txSubmitted} </div>
      </form>

      <br />
      <br />
      <div class="child-1-hg"> 
        <div style={{ display: "flex", width: "50%", margin: "auto" }}> 
          {dealIDButton()}
        </div>
      </div>
      {dealID && <div style={{ color: "green", margin:"auto" }}> Deal ID: {dealID}  </div>}

    </div>
  );
}

export default Inputs;
