//SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.5.0<0.9.0;

interface aave_functions{
  function balanceOf(address account) external view returns (uint);
  
  function deposit(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) external;

  function withdraw(address asset, uint256 amount, address to) external returns (uint256);

  function borrow(address asset, uint256 amount, uint256 interestRateMode, uint16 referralCode, address onBehalfOf) external;

  function repay(address asset, uint256 amount, uint256 rateMode, address onBehalfOf) external returns (uint256);

}

interface aave_weth{
  function depositETH(address lendingPool, address onBehalfOf, uint16 referralCode) external payable;
  function withdrawETH(address lendingPool, uint256 amount, address to) external;
  function repayETH(address lendingPool, uint256 amount, uint256 rateMode, address onBehalfOf) external payable;
  function borrowETH(address lendingPool, uint256 amount, uint256 interesRateMode, uint16 referralCode) external;
}

interface IERC20_functions {
    function totalSupply() external view returns (uint);

    function balanceOf(address account) external view returns (uint);

    function transfer(address recipient, uint amount) external returns (bool);

    function allowance(address owner, address spender) external view returns (uint);

    function approve(address spender, uint amount) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint amount
    ) external returns (bool);

}