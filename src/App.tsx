import styled from "styled-components";
import React, {useState} from 'react';
import Navbar from './Components/Navbar'
import Comments from './Components/Comments'
import GlobalStyle from './globalStyles'
import { copyAddress } from "./Components/copyAddress";

const Main = styled.div`
  width: 100%;
  font-family: 'Poppins', sans-serif;
  display: flex;
`

const AsideWrapper = styled.div`
  width: 35%;
  display: flex;
`

const AsidePanel = styled.div`
  top: 20px;
  width: 34%;
  height: 400px;
  position: fixed;
  display: flex;
  justify-content: flex-end; 
`
const UserStats = styled.div`
  color: #e1ebf6;
  display: flex;
  align-items: center;
  flex-direction: column;
`

const Address = styled.div`
  font-weight: 300; 
  padding-top: 20px;
`
const Balance = styled.div`
  font-weight: 300;
`
const UserInfo = styled.span`
  display: inline-block;
  font-weight: 500;
  margin-left: 5px;
  color: #000;
`
const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 9999px;
`
function App() {
  const [address, setAddress] = useState('');
  const [balance, setBalanceMain] = useState('');
  return (
    <Main>
        <GlobalStyle/>
        <Main>
            {
              address.length > 0 ? 
                <>
                  <AsideWrapper>
                    <AsidePanel>
                      <UserStats>
                        <ProfileImage src={`https://avatars.dicebear.com/api/personas/${address}.svg`} />
                              <Address>
                                  <UserInfo>
                                      {copyAddress(address)}
                                  </UserInfo>
                              </Address>
                              <Balance>
                                  <UserInfo>
                                      {(Number(balance).toFixed(1))} ETH
                                  </UserInfo>
                              </Balance>
                      </UserStats>
                    </AsidePanel>
                  </AsideWrapper>
                  <Comments address = {address}/> 
                  </>
                 :
                 <Navbar address = {address} setAddress = {setAddress} setBalanceMain = {setBalanceMain}/>
            }
        </Main>
    </Main>
  );
}

export default App;