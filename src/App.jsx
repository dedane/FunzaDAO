import { useAddress, useMetamask, useEditionDrop, useToken  } from '@thirdweb-dev/react';
import { EditionDrop } from '@thirdweb-dev/sdk';
import {useState, useEffect, useMemo} from 'react'



const App = () => {

  const address = useAddress();
  const connectWithMetamask = useMetamask();
  console.log(" address:", address);

  //Edition drop address on rinkeby testnet
const editionDrop  = useEditionDrop("0x35F3FAC08975eA1dE1Ae8ce4FFbF743592a4c320");
const token = useToken("0xeBAcfC634a98BbB11f7f0e48aBB3f132Ee004dcd");
  
  //State variable to check if they have an Nft
  const [hasClaimedNFT, setHasClaimedNft] = useState(false);
  //State variable to keep a loading screen while  NFT is minting
  const [isClaiming, setIsClaiming] = useState(false)

  //Holds the amount of token each member has in state
  const [memberTokenAmount, setMemberTokenAmount] = useState([]);
  //Array holding all our member addresses
  const [membersAddresses, setMembersAddresses] = useState([]);

  const shortenAddress = (str) => {
    //Shorten the Wallet address of each user
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  }

  //Gras all the addresses of our members holding the NFT
  useEffect(() => {
    if(!hasClaimedNFT){
      return;
    }
    const getAllAddresses = async () => {
    try{
      const allAddresses = await editionDrop.history.getAllAddresses();
      setMembersAddresses(membersAddresses);
      console.log("🙋 Members Addresses:", allAddresses);
    } catch(err){
      console.log("Error getting all addresses:", err);
    }
  };
  getAllAddresses();
},[hasClaimedNFT, editionDrop.history, membersAddresses]);

//This useEffects get the number of tokens each member has
useEffect(() => {
  if(!hasClaimedNFT){
    return;
  }
  const getAllBalances = async () => {
    try {
        const amounts = await token.history.getAllHolderBalances();
        setMemberTokenAmount(amounts);
        console.log( "🤑 Member Token Amounts:", amounts);
    }
    catch(err){
      console.log("Error getting all balances:", err);
    }
  };
  getAllBalances();
},[hasClaimedNFT, token.history]);

//Now we combine member addresses and token amounts to get a list of all members and their amounts
const allMembers = useMemo(() => {
  return membersAddresses.map((address, index) => {
    // 1 . Check to find the addresses in memberTokenAmmounts array
    //2. when found, return the address and the amount
    //3. if not found, return the address and 0
    const member = memberTokenAmount?.find(({holder}) => holder === address);

    return{
      address,
      tokenAmount: member?.balance.displayValue || "0",
    }
  });
}, [membersAddresses, memberTokenAmount]);

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
      <h1>👨‍🏫 FUNZA DAO 👩‍🏫 </h1>
      <p>Congratulations on being a member</p>
      <div>
        <div>
          <h2>Member List</h2>
          <table className="card">
            <thead>
              <tr>
                <th>Address</th>
                <th>Token Amount</th>
              </tr>
            </thead>
            <tbody>
              {allMembers.map((member) => {
                return (
                  <tr key={member.address}>
                    <td>{shortenAddress(member.address)}</td>
                    <td>{member.tokenAmount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
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
