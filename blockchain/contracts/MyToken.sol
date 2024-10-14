// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, Ownable {

    constructor() ERC20("MyToken", "MTK") Ownable(msg.sender) {
        // Mint initial supply to the deployer
        uint256 initialSupply = 1000000 * 10 ** decimals(); // 1 million tokens
        _mint(msg.sender, initialSupply);
    }

    // Staking-related functions
    mapping(address => uint256) public stakedBalance;
    mapping(address => uint256) public stakingStartBlock;
    mapping(address => uint256) public stakingRewards;

    uint256 public rewardRatePerBlock = 10; // Reward rate (tokens per block)

    // Stake function
    function stake(uint256 _amount) external {
        require(_amount > 0, "Cannot stake 0 tokens");
        require(balanceOf(msg.sender) >= _amount, "Insufficient token balance");

        _transfer(msg.sender, address(this), _amount); // Transfer tokens to contract
        stakedBalance[msg.sender] += _amount; // Update staked balance
        stakingStartBlock[msg.sender] = block.number; // Record staking start block
    }

    // Unstake function
    function unstake(uint256 _amount) external {
        require(_amount > 0, "Cannot unstake 0 tokens");
        require(stakedBalance[msg.sender] >= _amount, "Insufficient staked balance");

        _transfer(address(this), msg.sender, _amount); // Transfer tokens back to user
        stakedBalance[msg.sender] -= _amount; // Update staked balance

        // Calculate rewards for staking period
        claimReward(); // Claim the reward before unstaking
    }

    // Claim rewards
    function claimReward() public {
        uint256 reward = calculateReward(msg.sender);
        require(reward > 0, "No rewards available");

        _mint(msg.sender, reward); // Mint reward tokens
        stakingRewards[msg.sender] = 0; // Reset reward balance
        stakingStartBlock[msg.sender] = block.number; // Reset staking block
    }

    // View reward
    function viewReward() external view returns (uint256) {
        return calculateReward(msg.sender);
    }

    // Internal function to calculate rewards
    function calculateReward(address _staker) internal view returns (uint256) {
        uint256 stakedTime = block.number - stakingStartBlock[_staker];
        return (stakedBalance[_staker] * stakedTime * rewardRatePerBlock);
    }
}
