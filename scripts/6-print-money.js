import sdk from './1-initialize-sdk.js'
import dotenv from "dotenv";
dotenv.config();

const token =sdk.getToken(process.env.TOKEN_ADDRESS);

(async () => {
    try {
        const amount = 1000000000;
        await token.mint(amount);
        const totalSupply = await token.totalSupply();

        console.log("✅ There now is:", totalSupply.displayValue, "$Funza in circulation");
    }
    catch (error) {
        console.error("❌ Failed to print $FunzaToken:", error);
    }
})();