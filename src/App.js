import "./App.css";
import logo from "./logo.svg";
import { useEffect, useState } from 'react';
import Dashboard from './components/dashboard/Dashboard'
import Web3 from 'web3'
import { header_logo } from "./data/canvassrc";
import Market from "./components/marketplace/Market";


function App() {

  const [currentAccount, setCurrentAccount] = useState(null);
  const [currentChain, setCurrentChain] = useState(null);
  const [pageSelect, setPageSelect] = useState("ToonStone")
  const {ethereum} = window;
  const web3 = new Web3(Web3.givenProvider)

  const connectWalletHandler = async () => {
    if (!ethereum) {
      alert("Please install Metamask!");
    }

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      setCurrentAccount(accounts[0]);
      getChainId();
    } catch (err) {
      console.log(err)
    }
  }

  const connectWalletButton = () => {
    
    return (
      <button onClick={connectWalletHandler} id='connectWallet'>
        {currentAccount ? currentAccount : "Connect Wallet"}
      </button>
    )
  }

  const quickCanvas = () => {
    
  }

  const getChainId = async () => {
    ethereum.enable().then(async () => {
			let chain = await web3.eth.getChainId();
      setCurrentChain(chain)
    });
  }

  const actionButtons = () => {
    return (<>
      <button class="button-wrapper" id='ToonStone' onClick={() => {
        setPageSelect("ToonStone")
        }}>{"ToonStone"}
      </button>
       <button class="button-wrapper" id='Market' onClick={() => {
        setPageSelect("Market")
        }}>{"Marketplace"}
      </button>
    </>)
  }

  useEffect(() => {
    ethereum.on('accountsChanged', function () {
      connectWalletHandler();
    })
    ethereum.on('chainChanged', () => {
      getChainId();
    });
  }, [])

  return (
    <div className="App">
      <header>
            <img src={header_logo} id={"logo"}></img>
            {actionButtons()}
            {connectWalletButton()}
        </header>
        { pageSelect == "ToonStone" ?
        <Dashboard address={currentAccount} chain={currentChain}>
        </Dashboard> : <Market address={currentAccount} chain={currentChain}> </Market>}
    </div>
  );
}

export default App;
