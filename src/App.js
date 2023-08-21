import { useEffect, useState } from "react";
import "./App.css";
import Web3 from "web3";
import detectEthereumProvider from '@metamask/detect-provider'
import { loadContract } from "./utils/loadContract.js";
import { RotatingTriangles } from "react-loader-spinner";

function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    isProviderLoaded: false,
    web3: null,
    contract: null
  })

  const [account, setAccount] = useState(null);

  const [balance, setBalance] = useState(0);

  const [reload, setreload] = useState(false);

  const reloadEffect = () => setreload(!reload);

  const canConnectContract = account && web3Api.contract;

  const setAccountListener = (provider) => {
    provider.on("accountsChanged", (accounts) => {setAccount(accounts[0])});
    provider.on("chainChanged", _ => window.location.reload());
    provider._jsonRpcConnection.events.on("notification", (payload) => {
      const {method} = payload;

      if (method === "metamask_unlockStateChanged") {
        setAccount(null);
      }
    })
  }

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      

      // debugger

      if (provider) {
        const contract = await loadContract("Faucet", provider);
        setAccountListener(provider);
        setWeb3Api({
          web3: new Web3(provider),
          provider,
          contract,
          isProviderLoaded: true,
        });
      } else {
        setWeb3Api({...web3Api, isProviderLoaded: true})
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

    try {
      await contract.addFunds({from: account, value: web3.utils.toWei(amount, "ether")});
      reloadEffect();
    } catch {
      window.alert("Transaction request rejected by user!");
    }
  }

  const withdrawFunds = async () => {
    const amount = await window.prompt("How many ETH do you want to withdraw?");
    const { contract, web3 } = web3Api;

    try {
      await contract.withdraw(web3.utils.toWei(amount, "ether") , {from: account});
      reloadEffect();
    } catch {
      window.alert("Transaction request rejected by user!");
    }
  }

  return (
    <>
      <div className="faucet-wrapper">
      { web3Api.isProviderLoaded ?
        <div className="faucet">
          
            <div className="is-flex is-align-items-center">
          <span>
            <strong className="mr-2">Account: </strong>
          </span>
          
            {account 
            ? <div>{account}</div>
            : !web3Api.provider ? <>
              <div className="notification is-warning is-small is-rounded">
                Wallet not detected, <a target="_blank" href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn">install Metamask</a> now!
              </div>
            </> :
             <button className="button is-small" onClick={() => {web3Api.provider.request({method: "eth_requestAccounts"})}}>
                Connect Wallet
              </button>}
            </div> 
          <div className="balance-view is-size-2 my-4">
            Current Balance: <strong>{(Number(balance)/1000000000000000000).toString()}</strong> ETH
          </div>

          {
            !canConnectContract && <div className="notification is-warning is-small is-rounded">
              Please connect your wallet to the correct network.
            </div>
          }
          
          <button disabled={!canConnectContract} className="button is-link mr-2" onClick={addFunds}>Donate</button>
          <button disabled={!canConnectContract} className="button is-primary" onClick={withdrawFunds}>Withdraw</button>
        </div>
        : <RotatingTriangles
        visible={true}
        height="80"
        width="80"
        ariaLabel="rotating-triangels-loading"
        wrapperStyle={{}}
        wrapperClass="rotating-triangels-wrapper"
      />
      }
      </div>
    </>
  );
}

export default App;


// "postinstall": "rm -f ./node_modules/@web3-validator/lib/esm/package.json ./node_modules/@web3-errors/lib/esm/package.json",