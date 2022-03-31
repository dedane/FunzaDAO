import { useAddress, useMetamask, useEditionDrop } from '@thirdweb-dev/react';
import { EditionDrop } from '@thirdweb-dev/sdk';
import {useState, useEffect} from 'react'
import dotenv from "dotenv";
dotenv.config();

const App = () => {

  const address = useAddress();
  const connectWithMetamask = useMetamask();
  console.log(" address:", address);

  //Edition drop address on rinkeby testnet
  const editionDrop  = useEditionDrop(process.env.EditionDropAddress);
  //State variable to check if they have an Nft
  const [hasClaimedNft, setHasClaimedNft] = useState(false);
  //State variable to keep a loading screen while  NFT is minting
  const [isClaiming, setIsClaiming] = useState(false)

  useEffect(() => {
    //If they dont have a connected wallet
    if(!address){
      return
    }
    const checkBalance = async () => {
      try {
        const balance = await EditionDrop.balanceOf(address, 0);
        if(balance.gt(0)){
          setHasClaimedNft(true);
          console.log( "🚀 This used has a membership NFT!")
        } else {
          setHasClaimedNft(false);
          console.log( " ☠ This user does not have a membership Nft")
        }
      }
      catch(err){
        setHasClaimedNft(false);
        console.error( "😢 Failed to claim and Nft", err)
      } 
    }
    checkBalance()
  },[address, editionDrop])

  const mintNft = async() => {
    try {
      setIsClaiming(true);
      await editionDrop.claim("0", 1);
      console.log( ` 🌊 Successfully Minted! check it out on OpenSea: http://testnets.opensea.io/assets/${editionDrop.address}/0`);
      setHasClaimedNft(true)
    } catch(error){
      setHasClaimedNft(false);
      console.error( "🍂 Failed to mint Nft", error)
    }
    finally{
      setIsClaiming(false);
    }
  }

  if(!address) {
  return (
    <div className="landing">
      <h1> 👨‍💻   Welcome to FunzaDAO 👩‍💻 </h1>
      <button onClick={connectWithMetamask}>Connect your wallet</button>
    </div>
  );
}

return (
  <div className='Mint-Nft'>
    <h1>Mint your free 👨‍🏫👩‍🏫  DAO membership NFT</h1>
    <button
      disabled={isClaiming}
      onClick={mintNft}>
        {isClaiming ? "minting..." : "Mint your free Nft (FREE)"}
      </button>
    </div>
)
}
export default App;
