import {useState} from 'react';
import styled from "styled-components";
import { copyAddress } from './copyAddress'
const Web3 = require('web3');

const Nav = styled.div`
  height: 10vh;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #1DA1F2;
`
const ConnectMetamask = styled.button`
  border: none;
  border-radius: 99999px;
  cursor: pointer;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 600;
  padding: 16px 32px;
  background: #fff;
  color: #1DA1F2;
`
const Address = styled.div`
  font-weight: 800; 

  color: white;
`
const Balance = styled.div`
  font-weight: 800;
  color: white;
`
const UserInfo = styled.span`
  display: inline-block;
  font-weight: 400;
  margin-left: 5px;
`
const LogoBox = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`
const UserStats = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
`
const Logo = styled.img`
  width: 80px;
  height: 80px;
`
const ProfileImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 9999px;
  margin-left: 50px;
`
const LogoText = styled.h1`
  font-weight: 800;
  font-size: 1.5rem;
  color: #fff;
`
const LogoTextLight = styled.span`
  font-weight: 200;
  font-size: 1.25rem;
  color: #fff;
  margin: 2px;
`

interface NavbarProps {
    address: string,
    setAddress: (address: string) => void,
}
const Navbar = ({address, setAddress} : NavbarProps) => {
    const [checkAddress, setCheckAddress] = useState(false)
    const [balance, setBalance] = useState('');
    
    const connectToMetamask = async () => { 
        if(typeof window.ethereum !== undefined) {
            let web3 = new Web3(window.ethereum);
            try {
                await window.ethereum.enable();
                let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });;
                let mainAccountAddress = accounts[0];
                setAddress(mainAccountAddress);
                copyAddress(mainAccountAddress);
                setCheckAddress(!checkAddress);
                web3.eth.getBalance(mainAccountAddress).then((value: string) => {
                    setBalance(web3.utils.fromWei(value, 'ether'));
                })
            }
            catch(e) {
                console.log(e);
            }
        }
        else {
            console.log('Install Metamask');
        }
    }


    return (
        <Nav>
            <LogoBox>
                <Logo src={"/images/logo.png"} />
                <LogoText>
                    HashUp
                    <LogoTextLight>
                        Comments
                    </LogoTextLight>
                </LogoText>
            </LogoBox>
            {checkAddress ?
                <UserStats>
                    <div>
                        <Address>
                            Your Address:
                            <UserInfo>
                                {copyAddress(address)}
                            </UserInfo>
                        </Address>
                        <Balance>
                            Your Balance:
                            <UserInfo>
                                {(Number(balance)).toFixed(3)} ETH
                            </UserInfo>
                        </Balance>

                    </div>
                    <ProfileImage src={`https://avatars.dicebear.com/api/personas/${address}.svg`} />
                </UserStats>
                :
                <ConnectMetamask onClick = {connectToMetamask} className = "connect-metamask">Connect Metamask</ConnectMetamask>
            }
        </Nav>
    );
};

export default Navbar;