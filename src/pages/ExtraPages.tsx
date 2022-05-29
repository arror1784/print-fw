import React, { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import { IpcRendererEvent } from 'electron';

import { WorkingState } from '../../electron/printWorker'
function ExtraModals(){

    const navigate = useNavigate()

    const [lcdOFFVisible, setlcdOFFVisible] = useState<boolean>(false)
    const [shutDownVisible, setshutDownVisible] = useState<boolean>(false)

    window.electronAPI.onLCDStateChangedMR((event:IpcRendererEvent,state:boolean)=>{
        setlcdOFFVisible(state)
    })
    window.electronAPI.onLCDStateChangedMR((event:IpcRendererEvent)=>{
        setshutDownVisible(true)
    })
    window.electronAPI.onWorkingStateChangedMR((event:IpcRendererEvent,state:string)=>{
        switch(state){
            case WorkingState.working:
                navigate('/progress')
                break;
            default:
                break;
        }
    })
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