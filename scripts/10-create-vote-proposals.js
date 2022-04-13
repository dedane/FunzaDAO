import sdk from './1-initialize-sdk.js';
import { ethers } from 'ethers';
import dotenv from "dotenv";
dotenv.config();

//This is our goverance token
const vote = sdk.getVote(process.env.VOTE_CONTRACT_ADDRESS);

//This is our ERC20 contract
const token = sdk.getToken(process.env.TOKEN_ADDRESS);

(async () => {
    try{
        const amount = 420_000;
        const description = "Should the DAO mint an additional" + amount + " tokens into the treasury?";
        const executions = [
            {
                //Our token contract that actually executes the mint
                toAddess: token.getAddress(),
                //Our native token is eth
                //to send in this proposal. in this case we are sending in 0 ETH
                //We're just ,minting new tokens to the treasury so we set it to 0
                nativeTokenValue: 0,
                //We're doing a mint so that we can vote
                //acting as our treasury
                //In this case we are using ether.js to convert the amount
                //to the correct amount. this is because the amount it requires is in wei
                transactionData: token.encoder.encode(
                    "mintTo", [
                        vote.getAddress(),
                        ethers.utils.parseUnits(amount.toString(), 18)
                    ]
                )
            }
        ]
        await vote.propose(description, executions);
        console.log("✅ Proposal created");

    } catch(err){
        console.error("Failed to create the first proposal:", err);
        process.exit(1);
    }

    try {
        // Create proposal to transfer ourselves 6,900 tokens for being awesome.
        const amount = 6_900;
        const description = "Should the DAO transfer " + amount + " tokens from the treasury to " +
          process.env.WALLET_ADDRESS + " for being awesome?";
        const executions = [
          {
            // Again, we're sending ourselves 0 ETH. Just sending our own token.
            nativeTokenValue: 0,
            transactionData: token.encoder.encode(
              // We're doing a transfer from the treasury to our wallet.
              "transfer",
              [
                process.env.WALLET_ADDRESS,
                ethers.utils.parseUnits(amount.toString(), 18),
              ]
            ),
            toAddress: token.getAddress(),
          },
        ];
    
        await vote.propose(description, executions);
    
        console.log(
          "✅ Successfully created proposal to reward ourselves from the treasury, let's hope people vote for it!"
        );
      } catch (error) {
        console.error("failed to create second proposal", error);
      }
    })();