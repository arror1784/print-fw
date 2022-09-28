import React, { useEffect, useState } from 'react'
import Button from '../components/Button';

import classNames from 'classnames';

import checkImg from '../assets/check.png'
import errorImg from '../assets/error.png'

import styled from 'styled-components'

import Footer from '../layout/Footer';
import MainArea from '../layout/MainArea';
import Header from '../layout/Header';
import { useNavigate, useParams } from 'react-router-dom';
import { IpcRendererEvent } from 'electron';
import SlideText from '../components/SlideText';
import Modal from '../components/Modal';
import { ModalInfoTitle, ModalInfoValue, ModalNotice } from '../layout/ModalInfo';

function Complete(){
    
    let navigate = useNavigate()

    const [isError, setIsError] = useState<boolean>(false);
    const [errorModalVisible, seterrorModalVisible] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [filename, setFilename] = useState<string>("helll world");
    const [spentTime, setSpentTime] = useState<string>("Calculating");
    const [resin, setResin] = useState<string>("none");

    const { totalElapsedTime,error } = useParams()

    useEffect(()=>{
        const printInfoListener = window.electronAPI.onPrintInfoMR((event:IpcRendererEvent,state:string,material:string,filename:string,layerHeight:number
            ,elaspsedTime:number,totalTime:number,progress:number)=>{
            setFilename(filename)
            setResin(material)
            if(state === "error")
                setIsError(true)
        })
        
        window.electronAPI.requestPrintInfoRM()
        if(totalElapsedTime){
            let a = new Date(Number(totalElapsedTime))
            setSpentTime(a.getMinutes() +"min " + a.getSeconds() + "sec")
        }
        if(error && error.toLocaleLowerCase() != "false"){
            setIsError(true)
            setErrorMessage(error)
            seterrorModalVisible(true)
        }

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
                <InfoValue>
                    <SlideText text={filename}/>
                </InfoValue>
                <InfoText>Material</InfoText>
                <InfoValue>{resin}</InfoValue>
                <InfoText>Time Spent</InfoText>
                <InfoValue>{spentTime}</InfoValue>
            </InfoArea>
        </MainArea>
        <Footer>
                <Button color='gray' type='small' onClick={() => {
                    window.electronAPI.unlockRM()
                    window.electronAPI.printCommandRM("printAgain")
                }}> Print again </Button>
                <Button color='blue' type='small' onClick={() => {
                    window.electronAPI.unlockRM()
                    navigate('/') }}> Close </Button> 
        </Footer>
        <Modal visible={errorModalVisible} onBackClicked={() => {seterrorModalVisible(false)}} selectVisible={false}>
            <ModalNotice text={errorMessage}/>
        </Modal>
    </div>);
}
const FinishArea = styled.div`
    display: flex;
    align-items: center;
    /* justify-content: space-evenly; */
    margin-top: 45px;
`
const FinishImg = styled.img``

const FinishText = styled.div`
    color: black;

    font-size: 27px;
    margin-left: 30px;
`
const InfoArea = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    
    column-gap: 15px;
    row-gap: 10px;
    margin-top: 30px;
    font-size: 20px;
`
const InfoText = styled.div`
    color: #474747;
    justify-self: right;
`
const InfoValue = styled.div`
    color: black;
    justify-self: left;
    font-weight: bold;

    width: auto;
    max-width: 200px;
`

export default Complete;

