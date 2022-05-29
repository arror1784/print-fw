import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import styled from 'styled-components'

import Button from '../components/Button';
import Footer from '../layout/Footer';

import Modal from '../components/Modal';

import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import MainArea from '../layout/MainArea';
import Header from '../layout/Header';
import { useNavigate } from 'react-router-dom';
import { IpcRendererEvent } from 'electron';

import { useTimer } from 'react-timer-hook';

function Progress(){

    const navigate = useNavigate()

    const [progressValue, setProgressValue] = useState<number>(45)
    const [filename, setFilename] = useState<string>("")
    const [material, setMaterial] = useState<string>("")
    const [layerHeight, setLayerHeight] = useState<number>(0.1)
    const [expiryTimestamp, setExpiryTimestamp] = useState<Date>(new Date())

    const {
        seconds,
        minutes,
        hours,
        days,
        isRunning,
        start,
        pause,
        resume,
        restart,
      } = useTimer({ expiryTimestamp, onExpire: () => console.warn('onExpire called') });

    window.electronAPI.onProgressMR((event:IpcRendererEvent, progress:number) => {
        setProgressValue(Number((progress*100).toFixed()))
    })
    window.electronAPI.onPrintInfoMR((event:IpcRendererEvent,state:string,material:string,filename:string,layerHeight:number
        ,elaspsedTime:number,totalTime:number,progress:number,enableTimer:number)=>{
        setFilename(filename)
        setMaterial(material)
        setLayerHeight(layerHeight)
    })
    useEffect(()=>{
        window.electronAPI.requestPrintInfo()
    },[])
    useEffect(()=>{
        
        const {
            seconds,
            minutes,
            hours,
            days,
            isRunning,
            start,
            pause,
            resume,
            restart,
          } = useTimer({ expiryTimestamp, onExpire: () => console.warn('onExpire called') });

    },[expiryTimestamp])
    
    return (
        <div>
            <Header>
                
            </Header>
            <MainArea>
                <CircularProgressArea>

                    <TitleText>
                        File name
                    </TitleText>
                    <ValueText>
                        {filename}
                    </ValueText>
                    <TitleText>
                        Remaining time
                    </TitleText>
                    <ValueText>
                        asd
                    </ValueText>

                    <CircleProgress>
                        <CircularProgressbarWithChildren value={progressValue} maxValue={100} minValue={0} strokeWidth={7}
                            styles={buildStyles({
                                strokeLinecap: "round",
                                pathColor: `#00C6EA`,
                                trailColor: '#DCEAF3',
                            })}>
                            <ProgressBarText>
                                Progress
                            </ProgressBarText>
                            <ProgressValue>
                                {`${progressValue}%`}
                            </ProgressValue>
                        </CircularProgressbarWithChildren>
                    </CircleProgress>
                </CircularProgressArea>
            </MainArea>
            <Footer>
                <Button color='gray' type='small' onClick={() => {console.log("back btn clicked")}}> Print Info </Button>
                <Button color='blue' type='small' onClick={() => {navigate(-2)}}> Quit </Button> 
            </Footer>
            <Modal visible={false}>

            </Modal>
        </div>
    );
}
const CircularProgressArea = styled.div`
    display: grid;

    align-items: center;
    justify-content: center;
    align-content: center;

    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr;

    /* width: 360px; */
    // height: px;

    margin-top: 25px;
    column-gap: 30px;

`
const ProgressBarText = styled.div`
    color: #474747;
    font-size: 20px;
`
const ProgressValue = styled.div`
    color: #474747;
    font-size: 40px;
    font-weight: bold;
`
const TitleText = styled.div`
    color: #474747;
    font-size: 18px;
    justify-self: start;
    align-self: end;
        
`
const ValueText = styled.div`
    color: #474747;
    font-size: 30px;
    font-weight: bold;
    justify-self: start;
    align-self: start;
`
const CircleProgress = styled.div`
    grid-column-start: 2;
    grid-column-end: 3;

    grid-row-start: 1;
	grid-row-end: 5;

    align-self: center;
    justify-self: center;

    width: 180px;
    height: 180px;
`


export default Progress;