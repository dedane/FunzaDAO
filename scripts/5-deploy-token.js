import { AddressZero } from '@ethersProject/constants'
import sdk from "./1-initialize-sdk.js";

(async () => {  
    try {
        const tokenAddress =  await sdk.deployer.deployToken({
            name: "FunzaDao Governance Token",
            symbol: "$FUNZA",
            primary_sale_recipient: AddressZero,
        });
        console.log("☑ Successfully deployed token, address:", tokenAddress);
    }
    catch (error) {
        console.error("❌ Failed to deploy token:", error);
    }
})();