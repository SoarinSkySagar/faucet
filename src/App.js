import { useEffect, useState } from "react";
import "./App.css";
import Web3 from "web3";
import detectEthereumProvider from '@metamask/detect-provider'
import { loadContract } from "./utils/loadContract.js";

function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null
  })

  const [account, setAccount] = useState(null);

  const [balance, setBalance] = useState(0);

  const [reload, setreload] = useState(false);

  const reloadEffect = () => setreload(!reload);

  const setAccountListener = (provider) => {
    provider.on("accountsChanged", (accounts) => {setAccount(accounts[0])})
  }

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      const contract = await loadContract("Faucet", provider);

      // debugger

      if (provider) {
        setAccountListener(provider);
        setWeb3Api({
          web3: new Web3(provider),
          provider,
          contract
        });
      } else {
        console.error("Please install Metamask!");
      }
    };

    loadProvider();
  }, []);
  
  useEffect(() => {
    const getAccounts = async () => {
      const accounts = await web3Api.web3.eth.getAccounts();
      setAccount(accounts[0]);
    };

    web3Api.web3 && getAccounts();
  }, [web3Api.web3]);

  useEffect(() => {
    const loadBalance = async () => {
      const { contract, web3 } = web3Api;
      const ballance = await web3.eth.getBalance(contract.address);
      setBalance(ballance);

    }


    web3Api.contract && loadBalance();

    
  }, [web3Api, reload]);

  const addFunds = async () =>  {
    const amount = await window.prompt("How many ETH do you want to donate?");

    const { contract, web3 } = web3Api;
    await contract.addFunds({from: account, value: web3.utils.toWei(amount, "ether")});
    reloadEffect();
  }

  const withdrawFunds = async () => {
    const amount = await window.prompt("How many ETH do you want to withdraw?");

    const { contract, web3 } = web3Api;
    await contract.withdraw(web3.utils.toWei(amount, "ether") , {from: account});
    reloadEffect();
  }

  return (
    <>
      <div className="faucet-wrapper">
        <div className="faucet">
        <div className="is-flex is-align-items-center">
          <span>
            <strong className="mr-2">Account: </strong>
          </span>
          
            {account 
            ? <div>{account}</div>
            : <button className="button is-small" onClick={() => {web3Api.provider.request({method: "eth_requestAccounts"})}}>
                Connect Wallet
              </button>}
          </div>
          <div className="balance-view is-size-2 my-4">
            Current Balance: <strong>{(Number(balance)/1000000000000000000).toString()}</strong> ETH
          </div>
          
          <button className="button is-link mr-2" onClick={addFunds}>Donate</button>
          <button className="button is-primary" onClick={withdrawFunds}>Withdraw</button>
        </div>
      </div>
    </>
  );
}

export default App;
