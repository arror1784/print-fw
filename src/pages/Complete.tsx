import React, { useState } from 'react'
import Button from '../components/Button';

import classNames from 'classnames';

import checkImg from '../assets/check.png'
import styled from 'styled-components'

import Footer from '../layout/Footer';
import MainArea from '../layout/MainArea';
import Header from '../layout/Header';
import { useNavigate } from 'react-router-dom';

function Complete(){
    
    let navigate = useNavigate()

    const [status, setStatus] = useState<string>("normal");
    const [fileName, setFileName] = useState<string>("helll world");
    const [spentTime, setSpentTime] = useState<string>("15min 20sec");

    return (
    <div>
        <MainArea>
            <FinishArea>
                <FinishImg src={checkImg} width={60}/>
                <FinishText>
                    Printing Compeleted!
                </FinishText>
            </FinishArea>
            <InfoArea>
                <InfoText>File Name</InfoText>
                <InfoValue>{fileName}</InfoValue>
                <InfoText>Time Spent</InfoText>
                <InfoValue>{spentTime}</InfoValue>
            </InfoArea>
        </MainArea>
        <Footer>
                <Button color='gray' type='small' onClick={() => {
                    window.electronAPI.unLockRM()
                    window.electronAPI.printCommandRM("printAgain")
                }}> Print again </Button>
                <Button color='blue' type='small' onClick={() => {
                    window.electronAPI.unLockRM()
                    navigate('/') }}> Close </Button> 
        </Footer>
    </div>);
    // return (<div> <img src={wifiImg} sizes="(min-width: 600px) 200px, 50vw"/> </div>);
}
export const FinishArea = styled.div`
    display: flex;
    align-items: center;
    /* justify-content: space-evenly; */
    margin-top: 45px;
`
export const FinishImg = styled.img``

export const FinishText = styled.div`
    color: black;

    font-size: 27px;
    margin-left: 30px;
`
export const InfoArea = styled.div`
    display: grid;  
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    
    column-gap: 20px;
    row-gap: 15px;
    margin-top: 30px;
`
export const InfoText = styled.div`
    color: #474747;
    justify-self: right;
`
export const InfoValue = styled.div`
    color: black;
    justify-self: left;
    font-weight: bold;
`

export default Complete;

