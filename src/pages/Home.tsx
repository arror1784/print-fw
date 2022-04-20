import React from 'react'
import ImageButton from '../components/ImageButton';
import fileImg from '../assets/file.png';
import settingImg from '../assets/settings.png';
import infoImg from '../assets/info.png';
import styled from 'styled-components'

export interface IElectronAPI {
    sendToMain: () => void,
  }
  
  declare global {
    interface Window {
      electronAPI: IElectronAPI
    }
  }
  
function Home(){
    
    return (
    <HomeArea>
        <HomeContainer>
            <ImageButton type="main1" src={fileImg} onClick={() => {window.electronAPI.sendToMain()}}>Select File</ImageButton>
            <ImageButton type="main2" src={settingImg} color="gray">Setting</ImageButton>
            <ImageButton type="main2" src={infoImg} color="gray">Info</ImageButton> 
        </HomeContainer>
    </HomeArea>);
    // return (<div> <img src={wifiImg} sizes="(min-width: 600px) 200px, 50vw"/> </div>);
}
export const HomeArea = styled.div`
    display: flex;
    width: 480px;
    height: 320px;

    justify-content: center;
    align-items: center;
`
export const HomeContainer = styled.div`
    display: grid;
    grid-template-columns: 3fr 2fr;
    grid-template-rows: auto auto;

    justify-items: center;
    align-items: center;

    column-gap: 15px;
    
    > button:nth-child(1){
        grid-row-start: 1;
        grid-row-end: 3;
    }
    > button:nth-child(2){
        align-self: flex-start;

    }
    > button:nth-child(3){
        align-self: flex-end;

    }
`
export default Home;

