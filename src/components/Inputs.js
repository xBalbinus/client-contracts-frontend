import React, { useState, useEffect } from 'react';
import contract from '../contracts/DealClient.json';
import { ethers } from 'ethers';

const contractAddress = "0x4d0fB4EB0874d49AA36b5FCDb8321599817c723F";
const contractABI = contract.abi;

function Inputs() {
  const [commP, setCommP] = useState('');
  const [carLink, setCarLink] = useState('');
  const [pieceSize, setPieceSize] = useState('');

  const handleChangeCommP = (event) => {
    setCommP(event.target.value);
  }

  const handleChangeCarLink = (event) => {
    setCarLink(event.target.value);
  }

  const handleChangePieceSize = (event) => {
    setPieceSize(event.target.value);
  }

  const handleSubmit = (event) => {
    // This will be handling deal proposal submission sometime in the future.
    event.preventDefault();
    // do something with the carLink value, like send it to a backend API
    console.log(commP);
    console.log(carLink);
    console.log(pieceSize);
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

  const makeDealProposalHandler = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = provider.getSigner();
        const dealClient = new ethers.Contract(contractAddress, contractABI, signer);
        // console.log(await provider.getBalance("0x42c930a33280a7218bc924732d67dd84d6247af4"));
        console.log(dealClient.interface);
        const transaction = await dealClient.makeDealProposal("0x42c930a33280a7218bc924732d67dd84d6247af4");
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
      <button type="submit" onClick={makeDealProposalHandler} style={{ display: 'block' , width: '50%', margin: 'auto' }}>Submit</button>
    </form>
    
  );
}

export default Inputs;
