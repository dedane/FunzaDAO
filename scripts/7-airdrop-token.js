import sdk from './1-initialize-sdk.js';

const editionDrop = sdk.getEditionDrop(process.env.EditionDropAddress);

const token = sdk.getToken(process.env.TOKEN_ADDRESS);

(async() => {

    try {
        const walletAddress = await editionDrop.history.getAllClaimerAddresses(0);

        if(walletAddresses.length === 0){
            console.log(
                "No NFTs have been claimed yet, maybe get some friends to claim your free NFTs"

            );
            process.exit(0);
        }
        const airdropTargets = walletAddresses.map((address) => {
                //Pick a random # Betweeen 1000 and 10000
                const randomAmount = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000);
                console.log("💰 Sending", randomAmount, "$Funza to", address);

                const airdropTargets = {
                    toAddress: address,
                    amount: randomAmount,
                }
                return airdropTargets;
        })

        console.log( "🛫 Starting airdrop ....");
        await token.transferBatch(airdropTargets);
        console.log("✅ Successfully airdroped to all NFT Holders!");
    } catch(err) {
        console.error("❌ Failed to airdrop:", err);
    }
})();