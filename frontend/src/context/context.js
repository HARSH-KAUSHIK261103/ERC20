import React, { useState, useEffect, useContext } from "react";
import Web3 from "web3";
import Web3Modal from "web3modal";
import { Address, abi } from "./constants";

export const StakingContext = React.createContext();

export const StakingProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [contract, setContract] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [tokenBalance, setTokenBalance] = useState("0");
  const [stakedBalance, setStakedBalance] = useState("0");
  const [rewards, setRewards] = useState("0");

  // Function to connect wallet
  const connect = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const newWeb3 = new Web3(connection); 
    const accounts = await newWeb3.eth.getAccounts();
    setWeb3(newWeb3);

    if (accounts.length > 0) {
      setWalletAddress(accounts[0]);
      await getTokenBalance(accounts[0]); 
      await getStakedBalance(accounts[0]);
      await getRewards(accounts[0]);
    }
  };

  // Initialize the smart contract
  const setSmartContract = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const newWeb3 = new Web3(connection); 
    const newContract = new newWeb3.eth.Contract(abi, Address); 

    setContract(newContract); 
    setWeb3(newWeb3); 
  };

  useEffect(() => {
    connect();
    window.ethereum.on("accountsChanged", connect); 
    setSmartContract();
  }, []);

  // Get token balance (make sure decimals are correct)
  const getTokenBalance = async (address) => {
    if (!contract) return;
    const balance = await contract.methods.balanceOf(address).call();
    setTokenBalance(web3.utils.fromWei(balance, "ether")); // Make sure you're working with correct token decimals
  };

  // Get staked balance
  const getStakedBalance = async (address) => {
    if (!contract) return;
    const balance = await contract.methods.stakedBalance(address).call();
    setStakedBalance(web3.utils.fromWei(balance, "ether")); 
  };

  // Get rewards
  const getRewards = async (address) => {
    if (!contract) return;
    const reward = await contract.methods.viewReward().call({ from: address }); // Pass correct address
    setRewards(web3.utils.fromWei(reward, "ether")); 
  };

  // Stake tokens
  const stakeTokens = async (amount) => {
    if (!contract) return;
    const amountInWei = web3.utils.toWei(amount, "ether");
    await contract.methods.stake(amountInWei).send({ from: walletAddress });
    await getStakedBalance(walletAddress); 
    await getRewards(walletAddress); 
    await getTokenBalance(walletAddress); // Update token balance
  };

  // Unstake tokens
  const unstakeTokens = async (amount) => {
    if (!contract) return;
    const amountInWei = web3.utils.toWei(amount, "ether");
    await contract.methods.unstake(amountInWei).send({ from: walletAddress });
    await getStakedBalance(walletAddress); 
    await getRewards(walletAddress); 
    await getTokenBalance(walletAddress); // Update token balance
  };

  // Claim rewards
  const claimRewards = async () => {
    if (!contract) return;
    await contract.methods.claimReward().send({ from: walletAddress });
    await getRewards(walletAddress); // Update rewards after claiming
    await getTokenBalance(walletAddress); // Minted tokens, so update balance
  };

  return (
    <StakingContext.Provider
      value={{
        walletAddress,
        tokenBalance,
        stakedBalance,
        rewards,
        connect,
        stakeTokens,
        unstakeTokens,
        claimRewards,
      }}
    >
      {children}
    </StakingContext.Provider>
  );
};

export const useStaking = () => useContext(StakingContext);
