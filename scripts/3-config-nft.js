import sdk from './1-initialize-sdk.js'
import { readFileSync } from 'fs'
import dotenv from "dotenv";
dotenv.config();

const editionDrop = sdk.getEditionDrop(process.env.EditionDropAddress);

(async () => {
    try {
      await editionDrop.createBatch([
        {
          name: "Mwalimu",
          description: "This NFT will give you access to the teaching Portal",
          image: readFileSync("scripts/assets/Funza.png.png"),
        },
      ]);
      console.log("✅ Successfully created a new NFT in the drop!");
    } catch (error) {
      console.error("failed to create the new NFT", error);
    }
  })();
  