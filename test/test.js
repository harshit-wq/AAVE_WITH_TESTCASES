const {expect} = require("chai");
const { ethers } = require("hardhat");

describe("Tests", function(){
    let daiaddress="0x6b175474e89094c44da98b954eedeac495271d0f";
    let coinbase2= "0x503828976d22510aad0201ac7ec88293211d23da";
    let adai="0xfC1E690f61EFd961294b3e1Ce3313fBD8aa4f85d";
    let owner;
    let acc1;
    let acc2;
    let contract;
    let contract1;
    let contract2;
    let instance;
    let impersonatedaccount; // coinbase 2 account which has good amount of DAI tokens;

    beforeEach(async function(){
        [owner, acc1 ,acc2] = await ethers.getSigners();
        contract = await ethers.getContractFactory("interact");
        instance = await contract.deploy();
        await instance.deployed();

        contract1 = await ethers.getContractAt("IERC20_functions", daiaddress); 
        
        contract2 = await ethers.getContractAt("IERC20_functions", adai);

        await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [coinbase2],
          });
        impersonatedaccount=await ethers.getSigner(coinbase2);
        
    })

    it("deposit", async function(){
        const balance_before = await instance.connect(impersonatedaccount).mybalance(daiaddress);
        console.log("Balance of impersonated account in dai:",await contract1.connect(impersonatedaccount).balanceOf(impersonatedaccount.address)); //debug statement
        await contract1.connect(impersonatedaccount).approve(instance.address,100);
        await instance.connect(impersonatedaccount).isupply(daiaddress,100,0);
        const balance_after = await instance.connect(impersonatedaccount).mybalance(daiaddress);
        expect(balance_before).to.equal(balance_after);
        console.log("********* FIRST TESTCASE PASSED ************");
    })

    it("withdraw", async function(){
        /*const balance_before = await instance.connect(impersonatedaccount).mybalance(daiaddress);
        await contract1.connect(impersonatedaccount).approve(instance.address,100);
        await instance.connect(impersonatedaccount).isupply(daiaddress,100,0);
        const balance_after = await instance.connect(impersonatedaccount).mybalance(daiaddress);      // as the changes made are still intact we do not need these
        expect(balance_before).to.equal(balance_after);
        console.log("********* FIRST TESTCASE PASSED ************");*/

        const balance_of_user_before_withdraw = await contract1.balanceOf(impersonatedaccount.address);
        console.log(balance_of_user_before_withdraw);
        console.log(await contract2.balanceOf(instance.address));
        await instance.iwithdraw(daiaddress,90,impersonatedaccount.address);
        const balance_of_user_after_withdraw = await contract1.balanceOf(impersonatedaccount.address);
        console.log(balance_of_user_after_withdraw);
        expect (balance_of_user_after_withdraw).to.equal(balance_of_user_before_withdraw+90);
        console.log("********* SECOND TESTCASE PASSED ************");

    })

    it("borrow", async function(){

        const balance_before_taking_from_user = await instance.mybalance(daiaddress);
        await contract1.connect(impersonatedaccount).transfer(instance.address,100);
        const balance_after_taking_from_user = await instance.mybalance(daiaddress);
        console.log(balance_before_taking_from_user,balance_after_taking_from_user);
        await instance.iborrow(daiaddress, 100,1, 0);
        const balance_after_calling_aave = instance.mybalance(daiaddress);
        console.log(balance_before_taking_from_user,balance_after_taking_from_user);

    })


})      