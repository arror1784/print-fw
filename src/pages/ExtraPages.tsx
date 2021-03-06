import React, { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import { IpcRendererEvent } from 'electron';

function ExtraModals(){

    const navigate = useNavigate()

    const [lcdOFFVisible, setlcdOFFVisible] = useState<boolean>(false)
    const [shutDownVisible, setshutDownVisible] = useState<boolean>(false)
    useEffect(()=>{
        const lcdListener = window.electronAPI.onLCDStateChangedMR((event:IpcRendererEvent,state:boolean)=>{
            setlcdOFFVisible(state)
        })
        const shutdownListener = window.electronAPI.onShutDownMR((event:IpcRendererEvent)=>{
            setshutDownVisible(true)
        })
        const workingStateListener = window.electronAPI.onWorkingStateChangedMR((event:IpcRendererEvent,state:string)=>{
            switch(state){
                case "working":
                    navigate('/progress')
                    break;
                case "stop":
                case "error":
                    navigate('/complete')
                    break;
                default:
                    break;
            }
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

        </Modal>

        { /* ShutDown */ }
        <Modal visible={shutDownVisible} onBackClicked={() => {setshutDownVisible(false)}} selectString={"exit"} onSelectClicked={() => {navigate('/progress')}}>
        
        </Modal>
        
    </div>);
}
export default ExtraModals