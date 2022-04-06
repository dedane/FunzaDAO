import sdk from './1-initialize-sdk.js'
import { MaxUint256 } from '@ethersproject/constants'


const editionDrop = sdk.getEditionDrop(process.env.EditionDropAddress);

(async() => {
 try{
    const claimConditions = [{
        staetTime: new Date(),
        maxQuantity: 50000,
        price: 0,
        quanityLimitPerTransaction: 1,
        waitInSeconds: MaxUint256,
    }]
    await editionDrop.claimConditions.set("0", claimConditions);
    console.log("Successfully set claim condition")
 }
 catch(err){
    console.errpr("Failed to claim Nft", err)
 }
})();