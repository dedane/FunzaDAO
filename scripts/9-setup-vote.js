import sdk from './1-initialize-sdk.js';
import dotenv from "dotenv";
dotenv.config();

const vote = sdk.getVote(process.env.VOTE_CONTRACT_ADDRESS);
const token = sdk.getToken(process.env.TOKEN_ADDRESS);

(async () => {
    try {
        //Give your treasury the power to mint additional tokens
        await token.roles.grant("minter", vote.getAddress());

        console.log(
            'Successfully gave vote contract permisions to act on token contract'
        )

    } catch(err){
        console.error('Failed to grant vote contract:', err);
    
    process.exit(1);
}

try {
    const ownedTokenBalance = await token.balanceOf(process.env.WALLET_ADDRESS);


const ownedAmount = ownedTokenBalance.displayValue;
const percent90 = Number(ownedAmount) / 100 * 90;

//Transfer 90% of the supply to our voting contract
await token.transfer(
    vote.getAddress(),
    percent90
);

console.log('Successfully transfered' + percent90 + " tokens to vote contract");    
} catch(err){
    console.error("Failed to transfer tokens:", err);
}
})()