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

export default function Comments({address} : CommentsProps) {
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState<Array<any>>([]);

    let contractAddress: string = "0xa43b542D72660c67E337493b2929f87C5248d4FD";



    if(window.ethereum) {
        window.web3 = new Web3(window.ethereum);
    }
    else if(window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
    }else {
        window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }

    const web3 = window.web3

    let contract = new web3.eth.Contract(ABI, contractAddress);

    // let subscribe = web3.eth.subscribe('logs', {}, (error:Error, result:any ) => {
    //     if (!error){
    //         console.log("result: ", result)
    //         // setComments([...comments, result.returnValues]);
    //     }else console.log(`Error ${error}`)
    //
    // })


    const createComment = () => {
        if (typeof web3 !== "undefined" && comment.length > 0) {
            contract.methods.addComment(comment)
                .send({from: address, gas: 300000})
                // .on("receipt",  (receipt: object) => {
                //
                // })
                .on("error", (error: Error) => {console.error(error)})
        }
    }

    const tipComment = async (id: number) => {
        await contract.methods.tipComment(Number(id))
            .send({from: address, value: web3.utils.toWei("1", "ether"), gas: 3000000})
            // .on("confirmation", () => {
            //     console.log('confirmed')
            // })
            .on("receipt", (receipt: object) => {
                console.log(receipt)

            })

            .on("error", (error: Error) => {console.error(error)})


    }


    // Loading comments
    useEffect(() => {
        let loadedComments: any[] = []
        contract.events.allEvents({fromBlock: 0, toBlock: "latest"},(error: Error, pastEvent: any) => {
            if(!error) {
                if(pastEvent.event === "commentAdded") {
                    pastEvent.returnValues.tips = 0;
                    loadedComments.push(pastEvent.returnValues)
                }else if (pastEvent.event === "commentTipped") {
                    loadedComments[Number(pastEvent.returnValues.id)].tips += Number(web3.utils.fromWei(pastEvent.returnValues.amount, 'ether'));
                }else{
                    console.log('Event type not found ')
                }

            }
            else{
                console.log(error)
            }

        });
        setComments(loadedComments)
    }, [])


    // Funkcja oczekująca na komentarze
    // useEffect(() => {
    //     console.log('use effect 2')
    //
    //     contract.once("commentAdded", (error: Error, event: any) => {
    //         if(!error) setComments([...comments, event.returnValues]);
    //         else console.log(`Error ${error}`)
    //     })
    //
    //     contract.once("commentTipped", (error: Error, event: any) => {
    //         if(!error) {
    //             let comms: any = [...comments];
    //             if(comms.length > 0 ) {
    //                 const tempCom = {
    //                     content: comms[event.returnValues.id].content,
    //                     author: comms[event.returnValues.id].author,
    //                     tips: Number(comms[event.returnValues.id].tips) + 1,
    //                     id: comms[event.returnValues.id].id,
    //                     timestamp: comms[event.returnValues.id].timestamp,
    //                 };
    //                 comms[event.returnValues.id] = tempCom
    //                 setComments(comms)
    //             }
    //         }
    //         else console.log(`Error ${error}`)
    //     })
    // }, [comments])

    return (
        <CommentsContainer>
            <CommentsSearchBar>
                <ProfileImage src={`https://avatars.dicebear.com/api/personas/${address}.svg`} />
                <InputComment onChange = {(event: any) => setComment(event.target.value)} placeholder = "What's happening " type="text" defaultValue={comment}  />
                <AddCommentButton onClick = {createComment}>Reply</AddCommentButton>
            </CommentsSearchBar>
            {comments.map((comment, key) => (
                <>
                    <Comment content={comment.content} author = {comment.author} tips={Number(comment.tips)} timestamp={comment.timestamp} key = {key} id={key} tipComment = {tipComment}/>
                </>
            ))}
        </CommentsContainer>
    );
}

