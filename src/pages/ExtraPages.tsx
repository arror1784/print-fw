import React, { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import { IpcRendererEvent } from 'electron';
import { ModalNotice } from '../layout/ModalInfo';

function ExtraPages(){

    const navigate = useNavigate()

    const [lcdOFFVisible, setlcdOFFVisible] = useState<boolean>(false)
    const [shutDownVisible, setshutDownVisible] = useState<boolean>(false)

    useEffect(()=>{
        const lcdListener = window.electronAPI.onLCDStateChangedMR((event:IpcRendererEvent,state:boolean)=>{
            setlcdOFFVisible(state)
        })
        const shutdownListener = window.electronAPI.onShutDownEventMR((event:IpcRendererEvent)=>{
            setshutDownVisible(true)
        })
        const workingStateListener = window.electronAPI.onWorkingStateChangedMR((event:IpcRendererEvent,state:string,message?:string)=>{
            switch(state){
                case "working":
                    navigate('/progress')
                    break;
                default:
                    break;
            }
        })
        window.electronAPI.getUartConnectionErrorTW().then((value:boolean)=>{
            if(!value)
                navigate('/uartConnectionError')
        })
        return ()=>{
            window.electronAPI.removeListener(lcdListener)
            window.electronAPI.removeListener(shutdownListener)
            window.electronAPI.removeListener(workingStateListener)
        }
    },[])

    return (<div>

        { /* LCD OFF */ }
        <Modal visible={lcdOFFVisible} onBackClicked={() => {setlcdOFFVisible(false)}} selectVisible={false}>
            LCD OFF
        </Modal>

        { /* ShutDown */ }
        <Modal visible={shutDownVisible} onBackClicked={() => {setshutDownVisible(false)}} selectString={"exit"} onSelectClicked={
            () => {window.electronAPI.shutdownRM()}}>
            <ModalNotice text='Are you sure to exit?'/>
        </Modal>
        
    </div>);
}
export default ExtraPages