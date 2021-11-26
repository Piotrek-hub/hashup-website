import { useState, useEffect } from "react";
import styled from "styled-components";
import ABI from '../abis/abi.json';
import Comment from './Comment';

const Web3 = require('web3');

const CommentsContainer = styled.div`
  width: 30%;
  min-height: 85vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  border: 2px solid #dee2e6;
  border-radius: 15px;
`
const CommentsSearchBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 10px 0;
  width: 100%;
  border-bottom: 2px solid #dee2e6;
`
const ProfileImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 9999px;
`
const InputComment = styled.input`
  border: 0;
  outline: none;
  font-size: 1.25rem;
  white-space: pre-wrap;
  font-weight: 200;
`
const AddCommentButton = styled.button`
  border: none;
  border-radius: 99999px;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 10px 26px;
  background: #1DA1F2;
  color: #fff;
  margin-left: auto;
  margin-right: 10px;

  &:hover {
    background: rgb(26, 140, 216);
    color: #fff;
  }
`

interface CommentsProps {
    address: string,
}

export default function Comments({ address }: CommentsProps) {

    const [comment, setComment] = useState('');
    const [comments, setComments] = useState<Array<any>>([]);
    const [commentsLoaded, setCommentsLoaded] = useState(false);
    const [balance, setBalance ] = useState('');

    let contractAddress: string = "0xaB4C4B85Fb7519719eAF95A1fFc8C2C5DaA76a3C";

    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
    } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
    } else {
        window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }

    const web3 = window.web3
    let contract = new web3.eth.Contract(ABI, contractAddress);


    const createComment = async () => {

        if (typeof web3 !== "undefined" && comment.length > 0) {
            await contract.methods.addComment(comment, balance)
                .send({from: address})
                .on("receipt", (receipt: object) => {
                    console.log("Comment created")
                })
                .on("error", (error: Error) => {
                    console.error(error)
                })
        }
        setCommentsLoaded(false);
    }

    const tipComment = async (id: number) => {
        try {
            await contract.methods.tipComment(id, balance)
                .send({from: address, gas: 3000000})
                .on("confirmation", () => {
                    console.log('confirmed')
                })
                .on("receipt", (receipt: object) => {
                    console.log(receipt)
                })
                .on("error", (error: Error) => {
                    console.error(error)
                })
                setCommentsLoaded(false); 
            } catch (error:any) {
                console.log("You have already tipped")
            }

    }


    const getAddressesBalanceSum = () => {
        
        contract.methods.getTippers().call({from: address}).then((tippers: Array<string>) => {
            for(let tipper of tippers) {
                web3.eth.getBalance(tipper).then((balance: string) => {
                    console.log(`${tipper} : ${balance}`)
                })
            }
        });
    }

    const checkAddresses = async () => {
        contract.methods.getTotalTipsSum().call().then((tipsSum: string) => {
            tipsSum = web3.utils.fromWei(Number(tipsSum), "ether");


        })
    }
    useEffect(() => {
        contract.methods.getTippers().call() 
            .then(async (tippers: Array<string>) => {
                console.log(tippers)
            })
        web3.eth.getBalance(address).then((value: string) => {
            setBalance(value);
        })
        if(!commentsLoaded){
            (async () => {
                let loadedComments: any[] = [];
                const commentsAmount =  await contract.methods.getCommentCount().call();
    
                await contract.events.allEvents({fromBlock: 0}, (error: Error, pastEvent: any) => {
                    if (!error) {

                        if (pastEvent.event === "commentAdded") { 
                            pastEvent.returnValues.tips = 0;
                            loadedComments.push(pastEvent.returnValues)
                        }
                        
                        if (pastEvent.event === "commentTipped") {
                            loadedComments[Number(pastEvent.returnValues.id)].tips += Number(web3.utils.fromWei(pastEvent.returnValues.amount, 'ether'))
                            setCommentsLoaded(false); 
                        }

                        if(loadedComments.length >= commentsAmount) {
                            setComments(loadedComments);
                            setCommentsLoaded(true);  
                        }

                    } else {
                        console.log(error)
                    }
                })
            
        })();

        }
        contract.methods.getCommentTippers(0).call().then((tippers: Array<any>) => {
            tippers.forEach((tipper: string) => {
                web3.eth.getBalance(tipper).then(() => console.log('tipper', web3.eth.getBalance(tipper).then(console.log)))
            })
        })
    }, []);

    return (
        <CommentsContainer>
            
            <CommentsSearchBar>
                <ProfileImage src={`https://avatars.dicebear.com/api/personas/${address}.svg`} />
                <InputComment onChange={(event: any) => setComment(event.target.value)} placeholder="What's happening " type="text" defaultValue={comment} />
                <AddCommentButton onClick={createComment}>Reply</AddCommentButton>
            </CommentsSearchBar>
            {comments.map((comment, key) => (
                <>
                    <Comment content={comment.content} author={comment.author} tips={Number(comment.tips)} timestamp={comment.timestamp} key={key} id={key} tipComment={tipComment} />
                </>
            ))}
        </CommentsContainer>
    );

}

