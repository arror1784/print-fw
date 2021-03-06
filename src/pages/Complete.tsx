import React, { useEffect, useState } from 'react'
import Button from '../components/Button';

import classNames from 'classnames';

import checkImg from '../assets/check.png'
import errorImg from '../assets/error.png'

import styled from 'styled-components'

import Footer from '../layout/Footer';
import MainArea from '../layout/MainArea';
import Header from '../layout/Header';
import { useNavigate } from 'react-router-dom';
import { IpcRendererEvent } from 'electron';

function Complete(){
    
    let navigate = useNavigate()

    const [isError, setIsError] = useState<boolean>(false);
    const [filename, setFilename] = useState<string>("helll world");
    const [spentTime, setSpentTime] = useState<string>("15min 20sec");
    const [resin, setResin] = useState<string>("none");

    useEffect(()=>{
        const printInfoListener = window.electronAPI.onPrintInfoMR((event:IpcRendererEvent,state:string,material:string,filename:string,layerHeight:number
            ,elaspsedTime:number,totalTime:number,progress:number,enableTimer:number)=>{
            setFilename(filename)
            setResin(material)
            if(state === "error")
                setIsError(true)
        })
        
        window.electronAPI.requestPrintInfo()

        return ()=>{
            window.electronAPI.removeListener(printInfoListener)
        }
    },[])

    return (
    <div>
        <MainArea>
            <FinishArea>
                <FinishImg src={isError ? errorImg : checkImg} width={60}/>
                <FinishText>
                    {
                        isError ? "Printing Error!" : "Printing Compeleted!"
                    }
                </FinishText>
            </FinishArea>
            <InfoArea>
                <InfoText>File Name</InfoText>
                <InfoValue>{filename}</InfoValue>
                <InfoText>Material</InfoText>
                <InfoValue>{resin}</InfoValue>
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
    grid-template-rows: 1fr 1fr 1fr;
    
    column-gap: 15px;
    row-gap: 10px;
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

