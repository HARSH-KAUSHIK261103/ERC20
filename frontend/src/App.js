import React, { useState } from "react";
import { useStaking } from "./context/context";

const App = () => {
  const {
    walletAddress,
    tokenBalance,
    stakedBalance,
    rewards,
    connect,
    stakeTokens,
    unstakeTokens,
    claimRewards,
  } = useStaking();

  const [stakeAmount, setStakeAmount] = useState("");
  const [unstakeAmount, setUnstakeAmount] = useState("");

  return (
    <div className="app-container">
      <h1>Staking DApp</h1>

      {walletAddress ? (
        <div>
          <p>Connected wallet: {walletAddress}</p>
        </div>
      ) : (
        <button onClick={connect}>Connect Wallet</button>
      )}

      <div className="balance-info">
        <h3>Your Token Balance: {tokenBalance} MTK</h3>
        <h3>Your Staked Balance: {stakedBalance} MTK</h3>
        <h3>Your Rewards: {rewards} MTK</h3>
      </div>

      <div className="stake-section">
        <h3>Stake Tokens</h3>
        <input
          type="number"
          value={stakeAmount}
          onChange={(e) => setStakeAmount(e.target.value)}
          placeholder="Enter amount to stake"
        />
        <button onClick={() => stakeAmount > 0 && stakeTokens(stakeAmount)}>
          Stake Tokens
        </button>
      </div>

      <div className="unstake-section">
        <h3>Unstake Tokens</h3>
        <input
          type="number"
          value={unstakeAmount}
          onChange={(e) => setUnstakeAmount(e.target.value)}
          placeholder="Enter amount to unstake"
        />
        <button onClick={() => unstakeAmount > 0 && unstakeTokens(unstakeAmount)}>
          Unstake Tokens
        </button>
      </div>

      <div className="rewards-section">
        <button onClick={claimRewards}>Claim Rewards</button>
      </div>
    </div>
  );
};

export default App;
