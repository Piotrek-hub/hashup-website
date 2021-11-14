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
    let contractAddress: string = "0xc1710D4b1De7b2bc3550765079C346AC924Cd96F";




    if(window.ethereum) {
        window.web3 = new Web3(window.ethereum);
    }
    else if(window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
    }else {
        window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }

    const web3 = window.web3




    // let web3 = new Web3(new Web3.providers.WebsocketProvider("ws://localhost:8545"));
    // let web3js = new Web3(web3.currentProvider);

    let contract = new web3.eth.Contract(ABI, contractAddress);

    const createComment = async  () => {
        if (typeof web3 !== "undefined" && comment.length > 0) {
            await contract.methods.addComment(comment)
                .send({from: address, gas: 300000})
                .on("receipt", (receipt: object) => {
                    console.log("Comment created")
                })
                .on("error", (error: Error) => {console.error(error)})
        }
    }

    const tipComment = async (id: number) => {
        await contract.methods.tipComment(Number(id))
            .send({from: address, value: web3.utils.toWei("1", "ether"), gas: 3000000})
            .on("receipt", (receipt: object) => {
                console.log(receipt)
            })
            .on("error", (error: Error) => {console.error(error)})

    }

    // Funkcja ładująca komentarze
    useEffect(() => {
        contract.methods.getCommentCount()
            .call()
            .then((count:string) => {
                Number(count)
                let loadedComments: any[] = []
                for(let i = 0; i < Number(count); i++) {
                    contract.methods.getCommentById(i).call().then((comment:any) => {
                        loadedComments.push(comment);
                        loadedComments = [...comments, ...loadedComments];
                        setComments(loadedComments);
                    });
                }
            });
    }, [])



    // Funkcja oczekująca na komentarze
    useEffect(() => {
        // contract.events.commendAdded()
        //     .on("data", (event: any) => {
        //         console.log(event)
        //     })
        //     .on("error", (error:Error) => {
        //         throw error
        //     })
        contract.once("commentAdded", (error: Error, event: any) => {
            if(!error) setComments([...comments, event.returnValues]);
            else console.log(`Error ${error}`)
        })


        // contract.on("commentAdded", addComment)
        // contract.removeListener("commentAdded", addComment)

        contract.once("commentTipped", (error: Error, event: any) => {
            if(!error) {
                let comms: any = [...comments];
                if(comms.length > 0 ) {
                    const tempCom = {
                        content: comms[event.returnValues.id].content,
                        author: comms[event.returnValues.id].author,
                        tips: Number(comms[event.returnValues.id].tips) + 1,
                        id: comms[event.returnValues.id].id,
                        timestamp: comms[event.returnValues.id].timestamp,
                    };
                    comms[event.returnValues.id] = tempCom
                    setComments(comms)
                }
            }
            else console.log(`Error ${error}`)
        })

        // contract.events.commentTipped()
        //     .on("data", (event: any) => {
        //         let comms: any = [...comments];
        //         if(comms.length > 0 ) {
        //             const tempCom = {
        //                 content: comms[event.returnValues.id].content,
        //                 author: comms[event.returnValues.id].author,
        //                 tips: Number(comms[event.returnValues.id].tips) + 1,
        //                 id: comms[event.returnValues.id].id,
        //                 timestamp: comms[event.returnValues.id].timestamp,
        //             };
        //             comms[event.returnValues.id] = tempCom
        //             setComments(comms)
        //         }
        //     })
        //     .on('error', console.error)
    }, [comments])
    




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

