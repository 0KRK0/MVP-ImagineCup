"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';

const Home = () => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [connect, setConnect] = useState(false);
  const [balance, setBalance] = useState('');
  const user = 'Supervisor';

  const failMessage = "Please install MetaMask & connect your MetaMask";
  const successMessage = "Your account has been connected";

  const provider = new ethers.JsonRpcProvider(
    'https://mainnet.infura.io/v3/668405c01b4e44338647562e8b4fc608'
  );

  const WalletConnect = async () => {
    if (!window.ethereum) return;

    try {
      const accounts = await window.ethereum.request({ method: "eth_accounts" });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        setConnect(true);
        const balance = await provider.getBalance(currentAccount);
        setBalance( ethers.formatEther(balance));
      } else {
        resetState();  
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      resetState();
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      console.log(failMessage);
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setCurrentAccount(accounts[0]);
      setConnect(true);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      resetState();
    }
  };

  const resetState = () => {
    setCurrentAccount('');
    setConnect(false);
    setBalance('');
  };

  useEffect(() => {
    WalletConnect();
  }, []);

  useEffect(()=>{
    async function accountChanged() {
        window.ethereum.on('accountsChanged',async function(){
            const accounts=await window.ethereum.request({
                method:"eth_accounts",
            });
            if (accounts.length){
                setCurrentAccount(accounts[0])
            }else{
                window.location.reload();
            }
        });
    }accountChanged();
  },[]);

  interface ProjectData {
    _id: string;
    projectName: string;
    stageNumber: string;
    amountRequested: string;
    proofOfCompletion: string;
    verified: boolean;
  }

  const [data, setData] = useState<ProjectData[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/builder');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  


  const verifyRequest = async (id:string) => {
    try {
     
      const response = await axios.post('/api/supervisor',{id:id.toString()});
      console.log(response.data);
      fetchData();
      // Optionally, update UI or show success message
    } catch (error) {
      console.error('Error verifying request:', error);
      // Optionally, show error message
    }
  };

  return (
    <div>
      {!currentAccount && !connect ? (
        <div>
          <h1>WElcome Supervisor, Please Connect your wallet to view details</h1>
          <button onClick={connectWallet}>Connect Wallet</button>
        </div>
      ) : (
        <div>
          <h2>Hello Supervisor {currentAccount.slice(0,5)} </h2>
          <p>Account Address: {currentAccount}</p>
          <p>Account Balance: {balance} ETH</p>
          <h3>Submitted Requests</h3>
          <div>
            <ul>
              {data.map((item, index) => (
                <li key={index}>
                  <p>Project Name: {item.projectName}</p>
                  <p>Stage Number: {item.stageNumber}</p>
                  <p>Amount Requested: {item.amountRequested}</p>
                  <p>Proof of Completion: {item.proofOfCompletion}</p>
                  <p>Verified: {item.verified ? 'Yes' : 'No'}</p>
                  {!item.verified && (
                    <button onClick={() => verifyRequest(item._id)}>Verify</button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
