import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import styled from 'styled-components'

import Button from '../components/Button';
import Footer from '../layout/Footer';

import Modal from '../components/Modal';

import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import MainArea from '../layout/MainArea';
import Header from '../layout/Header';
import { useNavigate } from 'react-router-dom';
import { ipcRenderer, IpcRendererEvent } from 'electron';

import { ModalInfoMainArea, ModalInfoTitle, ModalInfoValue } from '../layout/ModalInfo';

import { Stopwatch } from 'ts-stopwatch'
import SlideText from '../components/SlideText';

function Progress(){

    const navigate = useNavigate()

    const [progressValue, setProgressValue] = useState<number>(45)
    const [filename, setFilename] = useState<string>("")
    const [material, setMaterial] = useState<string>("")
    const [layerHeight, setLayerHeight] = useState<number>(0.1)
    const [totalTime, setTotalTime] = useState(0)

    const [infoModalVisible,setInfoModalVisible] = useState<boolean>(false)
    const [quitModalVisible,setQuitModalVisible] = useState<boolean>(false)
    const [quitModalBtnEnable,setQuitModalBtnEnable] = useState<boolean>(false)
    const [quitWork,setQuitWork] = useState<boolean>(false)

    const isError = useRef(false)
    const stopwatchRef = useRef(new Stopwatch)
    const [elaspedTime, setelaspedTime] = useState(0)

    useEffect(()=>{
        const progressListener = window.electronAPI.onProgressMR((event:IpcRendererEvent, progress:number) => {
            setProgressValue(Number((progress*100).toFixed()))
        })
        const setTotalTimeListener = window.electronAPI.onSetTotalTimeMR((event:IpcRendererEvent,value:number)=>{
            console.log(value)
            setTotalTime(value)
        })
        const printerInfoListener = window.electronAPI.onPrintInfoMR((event:IpcRendererEvent,state:string,material:string,filename:string,layerHeight:number
            ,elaspsedTime:number,totalTime:number,progress:number,enableTimer:number)=>{
            setFilename(filename)
            setMaterial(material)
            setLayerHeight(layerHeight)
            setTotalTime(totalTime)
        })
        const workingStateListener = window.electronAPI.onWorkingStateChangedMR((event:IpcRendererEvent,state:string)=>{
            switch(state){
                case "working":
                    setQuitModalVisible(false)
                    stopwatchRef.current.start()
                    break;
                case "error":
                    isError.current = true
                    setQuitModalVisible(true)
                    setQuitWork(true)
                    break;
                case "stop":
                    stopwatchRef.current.stop()
                    console.log('/complete/'+stopwatchRef.current.getTime()+"/"+String(isError.current))
                    navigate('/complete/'+stopwatchRef.current.getTime()+"/"+String(isError.current))
                    break;
                case "pauseWork":
                    break;
                case "pause":
                    stopwatchRef.current.stop()
                    setQuitModalBtnEnable(true)
                    break;
                case "stopWork":
                    setQuitWork(true)
                    break;
                default:
                    break;
            }
        })

        window.electronAPI.requestPrintInfoRM()
        stopwatchRef.current.start()

        const id = setInterval(() => {

            setelaspedTime(stopwatchRef.current.getTime())
        }, 100)

        return ()=>{
            window.electronAPI.removeListener(printerInfoListener)
            window.electronAPI.removeListener(progressListener)
            window.electronAPI.removeListener(workingStateListener)
            window.electronAPI.removeListener(setTotalTimeListener)

            clearInterval(id)
        }
    },[])
    
    let time = new Date(totalTime - elaspedTime)
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
                        <SlideText text={filename}/>
                    </ValueText>
                    <TitleText>
                        Remaining time
                    </TitleText>
                    <ValueText>
                        {totalTime == 0 ? "Calculating" : time.getMinutes() +"min " + time.getSeconds() + "sec"}
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
                <Button color='gray' type='small' onClick={() => {setInfoModalVisible(true)}}> Print Info </Button>
                <Button color='blue' type='small' 
                onClick={() => {
                    setQuitModalVisible(true)
                    setQuitModalBtnEnable(false)
                    window.electronAPI.printCommandRM("pause")}}> Quit </Button> 
            </Footer>
            <Modal selectVisible={false} visible={infoModalVisible} onBackClicked={() => setInfoModalVisible(false)}>
                <ModalInfoMainArea>
                    <ModalInfoTitle text="File Name"/>
                    <ModalInfoValue text={filename}/>
                    <ModalInfoTitle text='Material'/>
                    <ModalInfoValue text={material}/>
                    <ModalInfoTitle text='Layer Height'/>
                    <ModalInfoValue text={`${layerHeight}mm/layer`}/>
                </ModalInfoMainArea>
            </Modal>
            <Modal visible={quitModalVisible} btnEnable={quitModalBtnEnable} selectString="Quit" backString="Resume"
                onBackClicked={() => window.electronAPI.printCommandRM("resume")}
                onSelectClicked={() => window.electronAPI.printCommandRM("quit")}
                backVisible={!quitWork} selectVisible={!quitWork}>
                    {
                        quitWork ? "wait for movement" : "Are you sure to quit?"
                    }
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
    max-width: 200px;
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