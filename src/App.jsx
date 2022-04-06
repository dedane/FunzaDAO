import { useAddress, useMetamask, useEditionDrop  } from '@thirdweb-dev/react';
import { EditionDrop } from '@thirdweb-dev/sdk';
import {useState, useEffect} from 'react'



const App = () => {

  const address = useAddress();
  const connectWithMetamask = useMetamask();
  console.log(" address:", address);

  //Edition drop address on rinkeby testnet
const editionDrop  = useEditionDrop("0x35F3FAC08975eA1dE1Ae8ce4FFbF743592a4c320");
  
  //State variable to check if they have an Nft
  const [hasClaimedNFT, setHasClaimedNft] = useState(false);
  //State variable to keep a loading screen while  NFT is minting
  const [isClaiming, setIsClaiming] = useState(false)

  useEffect(() => {
    //If they dont have a connected wallet
    if(!address){
      return
    }
    const checkBalance = async () => {
      try {
        const balance = await editionDrop.balanceOf(address, 0);
        if(balance.gt(0)){
          setHasClaimedNft(true);
          console.log( "🚀 This user has a membership NFT!")
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
      console.log(`🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`);
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
      <h1> 👨‍💻 Welcome to FunzaDAO 👩‍💻 </h1>
      <button onClick={connectWithMetamask} className="btn-hero">
        Connect your wallet
        </button>
    </div>
  );
}
if(hasClaimedNFT){
  return(
    <div className="member-page">
      <h1>DAO MEMBER PAGE</h1>
      <p>Congratulations on being a member</p>
    </div>
  )
}
return (
  <div className='mint-nft'>
    <h1>Mint your free 👨‍🏫👩‍🏫  DAO membership NFT</h1>
    <button
      disabled={isClaiming}
      onClick={mintNft}>
        {isClaiming ? "Minting..." : "Mint your free Nft (FREE)"}
      </button>
    </div>
)
}
export default App;
