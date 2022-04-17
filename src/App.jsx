import { useAddress, useMetamask, useEditionDrop, useToken, useVote  } from '@thirdweb-dev/react';
import { EditionDrop } from '@thirdweb-dev/sdk';
import {useState, useEffect, useMemo} from 'react'
import { AddressZero } from "@ethersproject/constants";


const App = () => {

  const address = useAddress();
  const connectWithMetamask = useMetamask();
  console.log(" address:", address);

  //Edition drop address on rinkeby testnet
const editionDrop  = useEditionDrop('0x17eEd51F1b245FB2725216169eeA57E59965bF9e');
const token = useToken('0xb8f89f090854cd45bfa7165904bac38c3eb42236');
const vote = useVote('0xb9Ae5865878150b104e7aECe239eB96B85c13766')
  
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

  const [proposals, setProposals] = useState([]);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    if(!hasClaimedNFT){
      return;
    }
    //A simple to grab all the proposals 
    const getAllProposals = async() => {
      try {
        const proposals = await vote.getAll();
        setProposals(proposals);
      }catch(err){
        console.error("Failed to fetch Proposals", err);
      }
    }
    getAllProposals();
  },[hasClaimedNFT, vote]);

  //We also check if the user has already voted
  useEffect(() => {
    if(!hasClaimedNFT){
      return;
    }
    if(!proposals.length){
      return;
    }

    const checkIfUserHasVoted = async() => {
      try{
        const hasVoted = await vote.hasVoted(proposals[0].proposalId, address);
        setHasVoted(hasVoted);
        if(hasVoted){
          console.log("This user has already voted");
        }
        else {
          console.log('User has not yet voted')
        }
      } catch(err){
        console.error("Failed to check if user has voted", err);

      }
    }
    checkIfUserHasVoted();
  }, [hasClaimedNFT, proposals, address, vote]);


  //Grabs all the addresses of our members holding the NFT
  useEffect(() => {
    if(!hasClaimedNFT){
      return;
    }
    const getAllAddresses = async () => {
    try{
      const allAddresses = await editionDrop.history.getAllClaimerAddresses(0);
      setMembersAddresses(allAddresses);
      console.log("🙋 Members Addresses:", allAddresses);
    } catch(err){
      console.log("Error getting all addresses:", err);
    }
  };
  getAllAddresses();
},[hasClaimedNFT, editionDrop.history]);

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
  return membersAddresses.map((address) => {
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
        <div>
          <h2>Active Proposals</h2>
          <form
              onSubmit={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsVoting(true);

                const votes = proposals.map((proposal) => {
                  const voteResult = {
                    proposalId: proposal.proposalId,
                    //abstain by default
                    vote: 2,
                  };
                  proposal.votes.forEach((vote) => {
                    const elem = document.getElementById(
                      proposal.proposalId + "." + vote.type
                    );
                    if (elem.checked) {
                      voteResult.vote = vote.type;
                      return
                    }
                  })
                  return voteResult;
                })
                try {
                  const delegation = await token.getDelegationOf(address);

                  if (delegation === AddressZero){
                    await token.delegateTo(address)
                  }
                  try{
                    await Promise.all(
                      votes.map(async ({proposalId, vote: _vote}) => {
                        const proposal = await vote.get(proposalId);

                        if(proposal.state === 1){
                          return vote.vote(proposalId, _vote);
                        }
                        return;
                      })
                    );
                    try {
                      await Promise.all(
                        votes.map(async ({proposalId}) => {
                          const proposal = await vote.get(proposalId);
                          if(proposal.state === 4){
                            return vote.execute(proposalId);
                          }
                        })
                      )
                        setHasVoted(true);

                        console.log("Successfully voted!");
                    }
                    catch(err){
                      console.error("Failed to vote", err);
                    }
                } catch(err){
                  console.error("Failed to delegate", err);
                } 
              }
                catch(err){
                  console.error("Failed to vote", err);
                }
                finally {
                  setIsVoting(false);
                }
              }}
              >
                {proposals.map((proposal) => (
                  <div key={proposal.proposalId} className="card">
                    <h5>{proposal.description}</h5>
                  <div>
                  {proposal.votes.map(({ type, label}) => (
                    <div key={type}>
                      <input  
                        type="radio"
                        id={proposal.proposalId + "-" + type}
                        name={proposal.proposalId}
                        value={type}
                        defaultChecked={type === 2} />
                        <label htmlFor={proposal.proposalId + "-" + type}>{label}</label>
                    </div>
                  
                ))}
                </div>
                </div>
                ))}
                <button disabled={isVoting || hasVoted} type="submit">
                  {isVoting ? "Voting..." : hasVoted ? "You already voted" : "Submit Vote"}
                </button>
                {!hasVoted && (
                  <small>
                    This will trigger multiple transactions that you will need to sign
                  </small>
                )}
              </form>
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
