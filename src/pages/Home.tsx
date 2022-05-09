import React, { useState } from 'react'
import ImageButton from '../components/ImageButton';
import fileImg from '../assets/file.png';
import settingImg from '../assets/settings.png';
import infoImg from '../assets/info.png';
import styled from 'styled-components'

import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';

function Home(){

    const navigate = useNavigate()
    const [version, setVersion] = useState<string>("")
    const [serial, setSerial] = useState<string>("")
    const [wifi, setWifi] = useState<string>("")
    const [ip, setIp] = useState<string>("")
    const [modalVisible,setModalVisible] = useState<boolean>(false)
    
    return (
    <HomeArea>
        <HomeContainer>
            <ImageButton type="main1" src={fileImg} onClick={() => {navigate('/model')}}>Select File</ImageButton>
            <ImageButton type="main2" src={settingImg} color="gray" onClick={() => {navigate('/setting')}}>Setting</ImageButton>
            <ImageButton type="main2" src={infoImg} color="gray" onClick={()=>{setModalVisible(true)}}>Info</ImageButton> 
        </HomeContainer>
        <Modal selectVisible={false} visible={modalVisible} onBackClicked={()=>{setModalVisible(false)}} >
            <InfoArea>
                <TitleText> Version </TitleText>
                <ValueText> {version} </ValueText>
                <TitleText> Serial</TitleText>
                <ValueText> {serial} </ValueText>
                <TitleText> WiFi </TitleText>
                <ValueText> {wifi} </ValueText>
                <TitleText> IP </TitleText>
                <ValueText> {ip} </ValueText>
            </InfoArea>
        </Modal>
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
export const InfoArea = styled.div`
    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-template-rows: 1fr 1fr 1fr 1fr;
    justify-items: right;
    row-gap: 5px;
    margin-top: 10px;
`
export const TitleText = styled.div`
    font-size: 23px;
    color: #474747;
    background-color: #00000000;
`
export const ValueText = styled.div``
export default Home;

