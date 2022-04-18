import sdk from './1-initialize-sdk.js'
import dotenv from "dotenv";
dotenv.config();

const token = sdk.getToken(process.env.TOKEN_ADDRESS);

(async () => {
    try  {
        const allRoles = await token.roles.getAll();

        console.log("👀 Roles that exist right now:", allRoles);

        await token.roles.setAll({ admin: [], minter : [] });

        console.log(
            "🎊 Roles after revoking ourselves", 
            await token.roles.getAll()
        );
        console.log("✅ Revoked roles successfully");

    } catch (error) {
        console.error("❌ Failed to revoke roles:", error);
    }
})();