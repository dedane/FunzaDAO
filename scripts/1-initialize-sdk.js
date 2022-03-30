import { ThirdwebSDK} from "@thirdweb-dev/sdk";
import ethers from "ethers"

import dotenv from "dotenv";
dotenv.config();

if(!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY === "") {
    console.log("Please set your private key and contract address in .env file");
    process.exit(1);
}

if(!process.env.ALCHEMY_API_URL || process.env.ALCHEMY_API_URL === "" ){
    console.log("Alchemy Api is not available")
}
if (!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS === "") {

    console.log("Enter your wallet address")
}
//Iniializing the sdk
const sdk = new ThirdwebSDK(
    new ethers.Wallet(
        //Getting access to your wallet private mkey
        process.env.PRIVATE_KEY,
        //RPC URL, We'll use our 
        ethers.getDefaultProvider(process.env.ALCHEMY_API_URL)
    ),
);

(async () => {
    try {
        const address = await sdk.getSigner().getAddress();
        console.log("👋 Your address is: ", address);
    } catch (err) {
        console.log("Failed to get Apps from the sdk", err)
        process.exit(1);
    }
})();

//Exporting the sdk to be used in other scripts
export default sdk;