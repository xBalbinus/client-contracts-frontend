import React, { useState, useEffect } from 'react';
import contract from '../contracts/DealClient.json';
import { ethers } from 'ethers';
const CID = require('cids')

const contractAddress = "0xab76119E5B3863c5d297693384777d5231E0Aeb2";
const contractABI = contract.abi;

function Inputs() {
  const [commP, setCommP] = useState('');
  const [carLink, setCarLink] = useState('');
  const [pieceSize, setPieceSize] = useState('');
  /*
  const [startEpoch, setStartEpoch] = useState('');
  const [endEpoch, setEndEpoch] = useState('');
  */

  const handleChangeCommP = (event) => {
    setCommP(event.target.value);
  }

  const handleChangeCarLink = (event) => {
    setCarLink(event.target.value);
  }

  const handleChangePieceSize = (event) => {
    setPieceSize(event.target.value);
  }

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

    const cid = new CID(commP);

    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const dealClient = new ethers.Contract(contractAddress, contractABI, signer);
        const extraParamsV1 = [
          carLink,
          1175,
          false, // taskArgs.skipIpniAnnounce,
          false // taskArgs.removeUnsealedCopy
        ]
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
        ]
        // console.log(await provider.getBalance("0x42c930a33280a7218bc924732d67dd84d6247af4"));
        console.log(dealClient.interface);
        const transaction = await dealClient.makeDealProposal(DealRequestStruct);
        console.log("Proposing deal...", );
        const receipt = await transaction.wait();
        console.log(receipt);
        
        console.log("Deal proposed!");
      }
      else {
        console.log("Ethereum object doesn't exist!");
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  const checkWalletIsConnected = () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    ethereum.request({ method: 'eth_accounts' }).then(accounts => {
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an account:", account);
      } else {
        console.log("No account found")
      }
    })
  }

  const connectWalletHandler = () => {
    const { ethereum } = window;
    if (!ethereum) {
      alert("Get MetaMask!");
      return;
    }
    ethereum.request({ method: 'eth_requestAccounts' })
      .then(accounts => {
        console.log("Connected", accounts[0]);
      })
      .catch(err => console.log(err));
  }

  const connectWalletButton = () => {
    return (
      <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
        Connect Wallet
      </button>
    )
  }

  useEffect(() => {
    checkWalletIsConnected();
  }, [])

  return (
    
    <form onSubmit={handleSubmit}>
      <div style = {{ display: 'block' , width: '50%', margin: 'auto' }}>
        {connectWalletButton()}
      </div>
      <div style = {{ display: 'block' , width: '50%', margin: 'auto' }}>
        Link to CAR file:
        <input type="text" value={carLink} onChange={handleChangeCarLink} />
      </div>
      <div style = {{ display: 'block' , width: '50%', margin: 'auto' }}>
        commP:
        <input type="text" value={commP} onChange={handleChangeCommP} />
      </div>
      <div style = {{ display: 'block' , width: '50%', margin: 'auto' }}>
        Piece Size:
        <input type="text" value={pieceSize} onChange={handleChangePieceSize} />
      </div>
      {/*
      <div style = {{ display: 'block' , width: '50%', margin: 'auto' }}>
        Start Epoch:
        <input type="text" value={startEpoch} onChange={handleChangeStartEpoch} />
      </div>
      <div style = {{ display: 'block' , width: '50%', margin: 'auto' }}>
        End Epoch:
        <input type="text" value={endEpoch} onChange={handleChangeEndEpoch} />
      </div>
    */}
      <button type="submit" style={{ display: 'block' , width: '50%', margin: 'auto' }}>Submit</button>
    </form>
    
  );
}

export default Inputs;
