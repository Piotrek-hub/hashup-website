import styled from "styled-components";
import { copyAddress } from './copyAddress'
import moment from 'moment';
import { useEffect, useState } from "react";

const CommentContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  border-bottom: 2px solid #e1ebf6;
  padding: 10px 0;
`
const InfoContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-around;
  flex-direction: column;
  height: 100%;
`

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

` 

const TipContainer = styled.div`
  display: flex;
  width: 90%;
  justify-content: space-between;
  padding-top: 10px;
`

const ProfileImageContainer = styled.div`
  height: 100%;
  width: 20%;
  display: flex;
  justify-content: center;
`

const ProfileImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 9999px;
`
const CommentAuthor = styled.span`
  font-weight: 600;

  span {
    color: #646464;
    font-weight: 300;
  }
`
const CommentContent = styled.span`
  font-weight: 300;
  padding-top: 5px;
  width: 90%;
  word-wrap: break-word;
  color: #3a3a3a;
`
const CommentTip = styled.button`
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
    tips: Number,
    content: string,
    tipComment: (id: any) => any,
    id: number,
}

const Comment = ({ author, timestamp, tips, content, tipComment, id }: CommentProps) => {
  return (
      <CommentContainer>
          <ProfileImageContainer>
              <ProfileImage src={`https://avatars.dicebear.com/api/personas/${author.toLowerCase()}.svg`} />
          </ProfileImageContainer>
          <Wrapper>
            <InfoContainer>
                <CommentAuthor>
                  {copyAddress(author)} {moment(new Date(Number(timestamp) * 1000)).fromNow(true)}
                </CommentAuthor>
                <CommentContent>
                    {content} //Tips: {tips.toFixed(0)}
                </CommentContent>
            </InfoContainer>
            <TipContainer>
              <CommentTip  onClick={() => { tipComment(id) }}>
                  <img src={"/images/thumbUp.svg"} width={"18px"} height={"18px"} />
              </CommentTip>
              <CommentTip  onClick={() => { tipComment(id) }}>
                  <img src={"/images/thumbDown.svg"} width={"18px"} height={"18px"} />
              </CommentTip>
              <CommentTip>
                  <img src={"/images/comment.svg"} width={"18px"} height={"18px"} />
              </CommentTip>
              <CommentTip>
                  <img src={"/images/share.svg"} width={"18px"} height={"18px"} />
              </CommentTip>
            </TipContainer>
          </Wrapper>
      </CommentContainer>
  )
  
}

export default Comment;