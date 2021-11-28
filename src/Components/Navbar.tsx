import {useState} from 'react';
import styled from "styled-components";
import { copyAddress } from './copyAddress'
const Web3 = require('web3');

const Nav = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #1DA1F2;
  position: fixed;
  left: 0;

  div {
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
`
const ConnectMetamask = styled.button`
  border: none;
  width: 100%;
  border-radius: 99999px;
  cursor: pointer;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 600;
  padding: 16px 48px;
  background: #fff;
  color: #1DA1F2;
`

const LogoBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 150px;
`

const Logo = styled.img`
  width: 200px;
  height: 200px;
`

const LogoText = styled.h1`
  font-weight: 800;
  font-size: 3rem;
  color: #fff;
`
const LogoTextLight = styled.span`
  font-weight: 200;
  font-size: 2rem;
  color: #fff;
  margin: 2px;
`

interface NavbarProps {
    address: string,
    setAddress: (address: string) => void,
    setBalanceMain: (address: string) => void,
}
const Navbar = ({address, setAddress, setBalanceMain} : NavbarProps) => {
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
                setBalanceMain(balance)
                setBalance('s')
                copyAddress(mainAccountAddress);
                setCheckAddress(!checkAddress);
                web3.eth.getBalance(mainAccountAddress).then((value: string) => {
                  setBalanceMain(web3.utils.fromWei(value, 'ether'));
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
                <></>
                :
                <div>
                  <ConnectMetamask onClick = {connectToMetamask} className = "connect-metamask">Connect Metamask</ConnectMetamask>
                </div>
            }
        </Nav>
    );
};

export default Navbar;