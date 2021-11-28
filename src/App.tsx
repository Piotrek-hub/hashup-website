import styled from "styled-components";
import React, {useState} from 'react';
import Navbar from './Components/Navbar'
import Comments from './Components/Comments'
import GlobalStyle from './globalStyles'

const Main = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`

function App() {
  const [address, setAddress] = useState('');
  return (
    <div>
        <GlobalStyle/>
        <Navbar address = {address} setAddress = {setAddress}/>
        <Main>
            {
                address.length > 0 && <Comments address = {address}/>
            }
        </Main>
    </div>
  );
}

export default App;