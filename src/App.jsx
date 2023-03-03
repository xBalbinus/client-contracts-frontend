import React from 'react';
import Inputs from './components/Inputs';
import "./App.css";

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

  return (
    <div className="App">
      <Inputs />
    </div>
  );
}

export default App;