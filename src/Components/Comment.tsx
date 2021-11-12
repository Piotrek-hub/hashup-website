import styled from "styled-components";
import {useState} from "react";
import { copyAddress } from './copyAddress'

const CommentContainer = styled.div`

  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  border-bottom: 2px solid #dee2e6;
  padding: 5px 0;
`
const InfoContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-around;
  flex-direction: column;
`

const ProfileImageContainer = styled.div`
  height: 100%;
`

const ProfileImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 9999px;
  margin-right: 20px;
`
const CommentAuthor = styled.span`
  font-weight: 500;
`
const CommentContent = styled.span`
  font-weight: 300;
  word-break: break-word;
`
const CommentTip = styled.button`
  height: 40px;
  margin-left: auto;
  background: none;
  font-size: 1rem;
  cursor: pointer;
  border: 0;
  color: rgba(0,0,0,0.6);
  &:hover{
    color: rgba(0,0,0,1);
  }
`


interface CommentProps {
    author: string,
    timestamp: string,
    initialTips: string,
    content: string,
    tipComment: (id: any) => any,
    id: number,
}
const Comment = ({author, timestamp, initialTips, content, tipComment, id} : CommentProps) => {
    const [tips, setTips ] = useState(initialTips);
    // @todo function to tip commennts


    return (
        <CommentContainer>
            <ProfileImageContainer>
                <ProfileImage src={`https://avatars.dicebear.com/api/personas/${author}.svg`} />
            </ProfileImageContainer>
            <InfoContainer>
                    <CommentAuthor>
                        {copyAddress(author)} {timestamp}
                    </CommentAuthor>
                    <CommentContent>
                        {content}
                    </CommentContent>
            </InfoContainer>
            <CommentTip >
                {initialTips}
                <img onClick = {() => {tipComment(id)}} src={"/images/ethereum.svg"} width={"32px"} height={"32px"}/>
            </CommentTip>
        </CommentContainer>
    )
}

export default Comment;