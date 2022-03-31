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
          console.log("This used has a membership NFT!")
        } else {
          setHasClaimedNft(false);
          console.log(" This user does not have a membership Nft")
        }
      }
      catch(err){
        setHasClaimedNft(false);
        console.error("Failed to claim and Nft", err)

      }
    }
    checkBalance()
  },[address, editionDrop])

  if(!address) {
  return (
    <div className="landing">
      <h1> 👨‍💻   Welcome to FunzaDAO 👩‍💻 </h1>
      <button onClick={connectWithMetamask}>Connect your wallet</button>
    </div>
  );
}

return (
  <div className='landing'>
    <h1>👀  Wallet connected to FunzaDAO, now what?</h1>
    </div>
)
}
export default App;
