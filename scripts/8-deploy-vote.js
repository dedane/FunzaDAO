import sdk from './1-initialize-sdk.js';
import dotenv from "dotenv";
dotenv.config();

(async () => {
    try{
        const voteContractAddress = await sdk.deployer.deployVote({
            //Give your governance contract a name
            name: "SHULE DAO",
            //This is the location of your governance token
            voting_token_address: process.env.TOKEN_ADDRESS,
            //These are specified in number of blocks
            //Assuming block of time around 13.14 seconds foe ethereum

            //After a proposal is created, when can members start voting?
            //for now we set this to immediately
            voting_delay_in_blocks: 0,

            //How long do members have to vote on a new proposal?
            //we will set it to 1 day = 6570 blocks
            voting_period_in_blocks: 6570,

            //The minimum total supplu needed to vote for the proposal
            voting_quorum_fraction: 0,

            //Minimum number of tokens needed to create a proposal
            proposal_token_threshold: 0,

        });
        console.log( " Successfully deployed vote contract, address:", voteContractAddress);

    } catch(err){
        console.error("Failed to deploy vote contract:", err);
    }
})();