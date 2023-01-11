const { ethers } = require("hardhat");

const BUCKET_ADD = "0x873289a1aD6Cf024B927bd13bd183B264d274c68";
const BUCKET_ABI = [{ "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "", "type": "address" }], "name": "Winner", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "erc20", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "drop", "outputs": [], "stateMutability": "nonpayable", "type": "function" }];

const CRIMEAN_COIN_ERC20_ADD = "0x57903CCE827604D19CD0Db7E56A8a97582120BF4";

async function main() {
    const [owner,] = await hre.ethers.getSigners();

    const bucketContract = await hre.ethers.getContractAt(BUCKET_ABI, BUCKET_ADD);
    const erc20Contract = await hre.ethers.getContractAt("CrimeanCoin", CRIMEAN_COIN_ERC20_ADD);

    console.log(`current wallet address CRC balance: ${owner.address} - ${await erc20Contract.balanceOf(owner.address)}`);


    const approvedAmount = (1 * 10 ** await erc20Contract.decimals()).toFixed();

    // approve 1 crimean coin to the bucket
    console.log(`Approving ${approvedAmount} to contract ${BUCKET_ADD}`);
    await erc20Contract.approve(BUCKET_ADD, approvedAmount);

    // claim 
    console.log(`Claiming ${approvedAmount} from ${CRIMEAN_COIN_ERC20_ADD}`);

    const tx = await bucketContract.drop(CRIMEAN_COIN_ERC20_ADD, approvedAmount);
    const receipt = await tx.wait()

    for (const event of receipt.events) {
        console.log(`Event ${event.event} with args ${event.args}`);
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
