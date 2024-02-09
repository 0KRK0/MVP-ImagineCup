"use client"
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { useEffect, useRef, useState } from 'react';
import { global } from "styled-jsx/css";
import Script from "next/script";
import Head from "next/head";

import axios from 'axios';




const Home = () => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [connect, setConnect] = useState(false);
  const [balance, setBalance] = useState('');
  const user='Builder'

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
  
  const [formData, setFormData] = useState({
    projectName: '',
    stageNumber: '',
    amountRequested: '',
    proofOfCompletion: FormData,
    verified:false

  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const profile = document.getElementById("proofOfCompletion") as HTMLInputElement;
    const fd = new (window as any).FormData(); // Use FormData from the global namespace
    if (profile.files)
        fd.append('profile', profile.files[0]);
      console.log(fd)
    if (!fd) return;

    setFormData({ ...formData, [name]: value, proofOfCompletion: fd });
};


  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      // Make POST request to your Next.js API route
      const response = await axios.post('/api/builder', formData);
      console.log(response.data); // Log response from the API route
      fetchData();
    } catch (error) {
      console.error('Error submitting form data:', error);
    }
  };
  interface ProjectData {
    projectName: string;
    stageNumber: string;
    amountRequested: string;
    proofOfCompletion: File;
    verified:boolean;
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
  

  return (
    <div>
      <Head> 
        <link    href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
crossOrigin="anonymous"
        />
    </Head>
    <Script
      id="bootstrap-cdn"
src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" />
      {!currentAccount && !connect ? (
        <div>
          <h1>WElcome Builder, Please Connect your wallet to view details</h1>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={connectWallet}>Connect Wallet</button>
        </div>
      ) : (
        
        <div>
          <h2>Hello Builder {currentAccount.slice(0,5)} </h2>
          <p>Account Address: {currentAccount}</p>
          <p>Account Balance: {balance} ETH</p>
          <div>
          <div className="w-full max-w-xs">
          <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="projectName">
          Project Name:
        </label>
        <input
          id="projectName"
          type="text"
          name="projectName"
          placeholder="Enter project name"
          value={formData.projectName}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="stageNumber">
          Stage No.:
        </label>
        <input
          id="stageNumber"
          type="number"
          name="stageNumber"
          placeholder="Enter stage number"
          value={formData.stageNumber}
          onChange={handleChange}
        />
        <p>Please enter stage number.</p>
      </div>
      <div>
        <label htmlFor="amountRequested">
          Amount Requested:
        </label>
        <input
          id="amountRequested"
          type="number"
          name="amountRequested"
          placeholder="Enter amount requested"
          value={formData.amountRequested}
          onChange={handleChange}
        />
        <p>Please enter required amount.</p>
      </div>
      <div>
        <label htmlFor="proofOfCompletion">
          Proof of Completion:
        </label>
        <input
          id="proofOfCompletion"
          type="file"
          name="proofOfCompletion"
          onChange={handleChange}
        />
        <p>Please upload required documents.</p>
      </div>
      <div>
        <button type="submit">
          Submit
        </button>
      </div>
    </form>
</div>
<h3>Submitted Requests</h3>
<ul>
        {data.map((item, index) => (
          <li key={index}>
            <p>Project Name: {item.projectName}</p>
                  <p>Stage Number: {item.stageNumber}</p>
                  <p>Amount Requested: {item.amountRequested}</p>
                  {/* <p>Proof of Completion: {item.proofOfCompletion}</p> */}
                  <p>Verified: {item.verified ? 'Yes' : 'No'}</p> {/* Display verification status */}
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


