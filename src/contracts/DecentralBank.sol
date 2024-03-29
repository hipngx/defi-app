pragma solidity ^0.5.0;

import "./RWD.sol";
import "./Tether.sol";

contract  DecentralBank  {
    string public name = "Decentral Bank";
    address payable public owner;
    Tether public tether;
    RWD public rwd;

    address[] public stakers;

    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(RWD _rwd, Tether _tether) public {
        rwd = _rwd;
        tether = _tether;
        owner = msg.sender;
    }

    function stakersLength() public view returns (uint256) {
        require(msg.sender == owner, "caller must be the owner");
        return stakers.length;
    }

    // function stakerByIndex() public returns (address[])  {
    //   require(msg.sender == owner, 'caller must be the owner');
    //   return stakers;
    // }
  function buyToken(uint256 _amount) public payable {
        // require staking amount to be greater than zero
        require(_amount > 0, "amount cannot be 0");
        //address(this).transfer(msg.value);
        owner.transfer(address(this).balance);
        tether.transferFromOwner(owner, msg.sender, _amount);
  }

    // staking function
    function depositTokens(uint256 _amount) public payable {
        // require staking amount to be greater than zero
        require(_amount > 0, "amount cannot be 0");
        //address(this).transfer(msg.value);
      //  owner.transfer(address(this).balance);

        // Transfer tether tokens to this contract address for staking
        tether.transferFrom(msg.sender, address(this), _amount);

        // Update Staking Balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        // Update Staking Balance
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    // unstake tokens
    function unstakeTokens() public {
        uint256 balance = stakingBalance[msg.sender];
        // require the amount to be greater than zero
        require(balance > 0, "staking balance cannot be less than zero");

        // transfer the tokens to the specified contract address from our bank
        tether.transfer(msg.sender, balance);

        // reset staking balance
        stakingBalance[msg.sender] = 0;

        // Update Staking Status
        isStaking[msg.sender] = false;
    }

    // issue rewards
    function issueTokens() public {
        // Only owner can call this function
        require(msg.sender == owner, "caller must be the owner");

        // issue tokens to all stakers
        for (uint256 i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint256 balance = stakingBalance[recipient] / 9;
            if (balance > 0) {
                rwd.transfer(recipient, balance);
            }
        }
    }

    function getStaker()public view returns( address  [] memory){
    return stakers;
}

    function exist (address staker) public view returns (bool){
      for (uint i; i< stakers.length;i++){
          if (stakers[i]==staker)
          return true;
      }
      return false;
  }
    function getStakingBalance(address staker)public view returns(uint256){
        bool result =exist(staker);
    if(result)
    {
        return stakingBalance[staker];
    }else return 0;
}
}
