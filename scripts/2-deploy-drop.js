import { AddressZero } from "@ethersproject/constants";
import sdk from './1-initialize-sdk.js'
import {readFileSync} from 'fs'

(async () => {
    try {
        const EditionDropAddress = await sdk.deployer.deployEditionDrop({
            //Collection name
            name: "FunzaDAO",
            //Collection description / what we want to achieve
            description: "A dao dedicated to teaching african children about WEB3",
            //Image that will be held in our NFT
            image: readFileSync('scripts/assets/funza.png.png'),
            //Who will be the owner of the collection
            //We are not charging for the collection
            //CAN BE ANY ADDRESS
            primary_sale_recipient: AddressZero
        })
        const editionDrop = sdk.getEditionDrop(EditionDropAddress);

        const metadata = await editionDrop.metadata.get();

        console.log("✅ Successfully deployed edition drop contract to : ", EditionDropAddress);
        console.log(" ✅ Edition drop metadata: ", metadata);
        
    } catch (err) {
        console.log("Failed to deploy editionDrop contract", err)
       
    }
})();