const {expect} = require("chai");
const { ethers } = require("hardhat");

describe("Tests", function(){
    let daiaddress="0x6b175474e89094c44da98b954eedeac495271d0f";
    let coinbase2= "0x503828976d22510aad0201ac7ec88293211d23da";
    let adai="0x028171bCA77440897B824Ca71D1c56caC55b68A3";
    let usdc="0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
    let interact_with = "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9";
    let owner;
    let acc1;
    let acc2;
    let contract;
    let contract1;
    let contract2;
    let contract3;
    let instance;
    let impersonatedaccount; // coinbase 2 account which has good amount of DAI tokens;

    
    beforeEach(async function(){
        [owner, acc1 ,acc2] = await ethers.getSigners();
        contract = await ethers.getContractFactory("interact");
        instance = await contract.deploy();
        await instance.deployed();

        contract1 = await ethers.getContractAt("IERC20_functions", daiaddress); 
        
        contract2 = await ethers.getContractAt("IERC20_functions", adai);

        contract3 = await ethers.getContractAt("IERC20_functions", usdc);

        await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [coinbase2],
          });
        impersonatedaccount=await ethers.getSigner(coinbase2);
        
    })

    it("deposit", async function(){
        const balance_before = await instance.connect(impersonatedaccount).mybalance(daiaddress);
        console.log("Balance of impersonated account in dai:",await contract1.connect(impersonatedaccount).balanceOf(impersonatedaccount.address)); //debug statement
        await contract1.connect(impersonatedaccount).approve(instance.address,"10525039806330423");
        await instance.connect(impersonatedaccount).isupply(daiaddress,"10525039806330423",0);
        const balance_after = await instance.connect(impersonatedaccount).mybalance(daiaddress);
        const my_adai_balance = await instance.connect(impersonatedaccount).mybalance(adai);
        console.log("my contract's adai balance :", my_adai_balance);
        expect(balance_before).to.equal(balance_after); // checking that our balance is same before and after
        expect(my_adai_balance).to.equal("10525039806330423"); // checking that we recieved adai
        console.log("********* FIRST TESTCASE PASSED ************");
    })

    it("withdraw", async function(){
        console.log("adai:", await instance.connect(impersonatedaccount).mybalance(adai));   // i dont get why our adai balance is 0, it should be 10525039806330423
        const balance_before = await instance.connect(impersonatedaccount).mybalance(daiaddress);
        const balance_before1= await contract1.balanceOf(impersonatedaccount.address);
        await contract1.connect(impersonatedaccount).approve(instance.address,500000);
        await instance.connect(impersonatedaccount).isupply(daiaddress,500000,0);
        const balance_after = await instance.connect(impersonatedaccount).mybalance(daiaddress);      // as the changes made are still intact we do not need these
        expect(balance_before).to.equal(balance_after);
        console.log("*********************")
        console.log("Desposit of 500000 is succesful from user's address and our contract has succesfully deposited in aave and recieved ADAI ");
        console.log("*********************")


        const balance_of_user_before_withdraw = await contract1.balanceOf(impersonatedaccount.address);
        console.log("users balance before withdraw:",balance_of_user_before_withdraw);
        const my_contract_adai_balance = await instance.mybalance(adai);
        console.log("my adai contract balance:",my_contract_adai_balance);
        await instance.iwithdraw(daiaddress,500000,impersonatedaccount.address);
        const balance_of_user_after_withdraw = await contract1.balanceOf(impersonatedaccount.address);
        console.log("balance of user after withdraw:",balance_of_user_after_withdraw);
        expect (balance_of_user_after_withdraw).to.equal(balance_before1);  // checking the initial and final deposit to withdraw ammount
        expect(await contract2.balanceOf(instance.address)).to.equal(0);    // checking our ocntract's balance in adai
        console.log("********* SECOND TESTCASE PASSED ************");

    })

    it("borrow", async function(){
        //instance.getstate()
        console.log("adai:", await contract2.balanceOf(instance.address));   // i dont get why our adai balance is 0, it should be 10525039806330423
        const balance_before = await instance.connect(impersonatedaccount).mybalance(daiaddress);
        const balance_before1= await contract1.balanceOf(impersonatedaccount.address);
        await contract1.connect(impersonatedaccount).approve(instance.address,"10000000000000000000");
        await instance.connect(impersonatedaccount).isupply(daiaddress,"10000000000000000000",0);
        const balance_after = await instance.connect(impersonatedaccount).mybalance(daiaddress);      // as the changes made are still intact we do not need these
        expect(balance_before).to.equal(balance_after);
        console.log("*********************")
        console.log("Desposit of 10000000000000000000 is succesful from user's address and our contract has succesfully deposited in aave and recieved ADAI ");
        console.log("*********************")


        console.log("my contract adai:", await contract2.balanceOf(instance.address));


        console.log("User's account USDC balance: ",await contract3.balanceOf(impersonatedaccount.address));
        const usdc_balance_before = await contract3.balanceOf(impersonatedaccount.address);
        await instance.connect(impersonatedaccount).iborrow(daiaddress,usdc,"200000",2, 0);
        console.log("User's usdc balance after borrowning:", await contract3.balanceOf(impersonatedaccount.address));
        const usdc_balance_after_borrowing = await contract3.balanceOf(impersonatedaccount.address);
        
        expect (usdc_balance_after_borrowing).to.equal(BigInt(BigInt(usdc_balance_before)+BigInt(200000)));

        console.log("I have borrowed 200000 USDC from aave keeping my dai as collateral")
        console.log("********* THIRD TESTCASE PASSED ************");

    })

    it("repay", async function(){
        //instance.getstate()
        console.log("adai:", await contract2.balanceOf(instance.address));   // i dont get why our adai balance is 0, it should be 10525039806330423
        const balance_before = await instance.connect(impersonatedaccount).mybalance(daiaddress);
        const balance_before1= await contract1.balanceOf(impersonatedaccount.address);
        await contract1.connect(impersonatedaccount).approve(instance.address,"10000000000000000000");
        await instance.connect(impersonatedaccount).isupply(daiaddress,"10000000000000000000",0);
        const balance_after = await instance.connect(impersonatedaccount).mybalance(daiaddress);      // as the changes made are still intact we do not need these
        expect(balance_before).to.equal(balance_after);
        console.log("*********************")
        console.log("Desposit of 10000000000000000000 is succesful from user's address and our contract has succesfully deposited in aave and recieved ADAI ");
        console.log("*********************")


        console.log("my contract adai:", await contract2.balanceOf(instance.address));


        console.log("User's account USDC balance: ",await contract3.balanceOf(impersonatedaccount.address));
        const usdc_balance_before = await contract3.balanceOf(impersonatedaccount.address);
        await instance.connect(impersonatedaccount).iborrow(daiaddress,usdc,"200000",2, 0);
        console.log("User's usdc balance after borrowning:", await contract3.balanceOf(impersonatedaccount.address));
        const usdc_balance_after_borrowing = await contract3.balanceOf(impersonatedaccount.address);
        expect (usdc_balance_after_borrowing).to.equal(BigInt(BigInt(usdc_balance_before)+BigInt(200000)));
        console.log("*********************");
        console.log("I have borrowed 200000 USDC from aave keeping my dai as collateral")
        console.log("*********************");


        const usdc_balance_of_user_before = await contract3.balanceOf(impersonatedaccount.address);
        console.log("usdc_balance_of_user_before: ",usdc_balance_of_user_before);
        await contract3.connect(impersonatedaccount).approve(instance.address,200000);
        await instance.connect(impersonatedaccount).irepay(usdc,200000,2);
        const usdc_balance_of_user_after = await contract3.balanceOf(impersonatedaccount.address);
        console.log("usdc_balance_of_user_after: ",usdc_balance_of_user_after);

        expect (usdc_balance_of_user_before).to.equal(BigInt(usdc_balance_of_user_after)+BigInt(200000));
        console.log("********* FOURTH TESTCASE PASSED ************");


    })


})      