import React, { useEffect } from 'react';
import CarFileInput from './components/CarFileInput';
import CommPInput from './components/CommPInput';
import contract from './contracts/DealClient.json';
import { ethers } from 'ethers';

const contractAddress = "";
const contractABI = contract.abi;

/*
import {
  useBalance,
  useContractLoader,
  useContractReader,
  // useOnBlock,
  useUserProviderAndSigner,
} from "eth-hooks";

import externalContracts from "./contracts/external_contracts";
// contracts
import deployedContracts from "./contracts/hardhat_contracts.json";
*/

function App() {

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
        console.log("Found an authorized account:", account);
      } else {
        console.log("No authorized account found")
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

  const makeDealProposalHandler = () => {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const dealClient = new ethers.Contract(contractAddress, contractABI, signer);
      try {
        const transaction = dealClient.makeDealProposal();
        console.log("Proposing deal...", transaction.hash);
        transaction.wait().then((receipt) => {
          console.log("Proposed --", receipt);
        });
      } catch (err) {
        console.log("Error: ", err);
      }
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
    <div className="App">
      <div>
        {connectWalletButton()}
      </div>
      <CarFileInput />
      <CommPInput />
    </div>
  );
}

export default App;