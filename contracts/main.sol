//SPDX-License-Identifier: GPL-3.0


pragma solidity >=0.5.0<0.9.0;

import "./interface.sol";

import "hardhat/console.sol";

contract interact{

    
    address private interact_with = 0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9;
    address private weth_address=0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9;
    


    function mybalance(address _asset) external view returns(uint) {
        IERC20_functions token = IERC20_functions(_asset); 

        console.log("senders balance:",token.balanceOf((msg.sender)),"contract's balance:",token.balanceOf(address(this)));

        return token.balanceOf((address(this)));
    }

    function isupply(address _asset, uint256 _amount, uint16 _referralCode) external {

        IERC20_functions token = IERC20_functions(_asset);  
        require(token.transferFrom(msg.sender, address(this), _amount), "You do not have enough balance");
        aave_functions instance = aave_functions(interact_with);
        require(token.approve(interact_with,_amount), "Not approved");
        instance.deposit(_asset, _amount, address(this), _referralCode); //should this onBehalfOf be the address of this contract

    }

    function iwithdraw(address asset, uint256 amount, address to) external {
        IERC20_functions token = IERC20_functions(asset);
        aave_functions instance = aave_functions(interact_with);
        instance.withdraw(asset, amount, address(this)); 
        require(token.transfer(to,amount));
    }

    function iborrow(address asset, uint256 amount,uint256 interestRateMode, uint16 referralCode) external {
        IERC20_functions token = IERC20_functions(asset);
        aave_functions instance = aave_functions(interact_with);
        instance.borrow(asset, amount, interestRateMode, referralCode, address(this));
        require(token.transfer(msg.sender,amount));
    }

    function irepay(address asset, uint256 amount, uint256 rateMode) external {
        IERC20_functions token = IERC20_functions(asset);

        require(token.transferFrom(msg.sender, address(this), amount));

        aave_functions instance = aave_functions(interact_with);
        require(token.approve(interact_with,amount));
        instance.repay(asset, amount, rateMode, address(this));
    }

}