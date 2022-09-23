import { decode } from 'js-base64';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import styled from 'styled-components'

import Button from '../components/Button';
import Footer from '../layout/Footer';

import Header from '../layout/Header';
import MainArea from '../layout/MainArea';
import UpdateLayout, { UpdateState } from '../layout/UpdateLayout';

enum UpdateNotice{
    start=1,
    finish=2,
    error=3,
}

function Update(){
    const navigate = useNavigate()
    const {updateTarget,updatePath,updateMode} = useParams()
    
    const [updateEnable, setupdateEnable] = useState(true)
    const [currentVersion, setcurrentVersion] = useState("")
    const [latestVersion, setlatestVersion] = useState("")
    const [statusString, setstatusString] = useState<UpdateState>('updateCheck')
    

    const decodingUpdatePath = updatePath && decode(updatePath)

    const getCurrentVersion = ()=>{
        if(updateTarget == "resin"){
            window.electronAPI.getResinCurrentVersion().then((v:Date)=>{
                setcurrentVersion(v.toLocaleString())
            })
        }else{
            window.electronAPI.getSWCurrentVersionTW().then((v:string)=>{
                setcurrentVersion(v)
            })
        }
    }
    const getServerVersion = () => {
        if(updateTarget == "resin"){
            if(updateMode == "network"){
                window.electronAPI.getResinServerVersion().then((v:Date|null)=>{
                    if(v)
                        setlatestVersion(v.toLocaleString())
                    else
                        setstatusString('networkError')
                })
            }else{
                if(!decodingUpdatePath){
                    setstatusString("fileError")
                    return
                }
                window.electronAPI.getResinFileVersion(decodingUpdatePath).then((v:Date|null)=>{
                    if(v)
                        setlatestVersion(v.toLocaleString())
                    else
                        setstatusString('fileError')
                })
            }
        }else{
            if(updateMode == "network"){
                window.electronAPI.getSWServerVersionTW().then((v:string|null)=>{
                    if(v)
                        setlatestVersion(v)
                    else
                        setstatusString('networkError')
                })
            }else{
                if(!decodingUpdatePath){
                    setstatusString("fileError")
                    return
                }
                window.electronAPI.getSWFileVersionTW(decodingUpdatePath).then((v:string|null)=>{
                    if(v)
                        setlatestVersion(v)
                    else
                        setstatusString('fileError')
                })
            }
        }
    }
    useEffect(()=>{
        const updateNoticeListner = window.electronAPI.onUpdateNoticeMR((event:Electron.IpcRendererEvent,value:UpdateNotice)=>{
            switch (value) {
                case UpdateNotice.start:
                    setstatusString('updating')
                    break;
                case UpdateNotice.finish:
                    getCurrentVersion()
                    setupdateEnable(true)
                    setstatusString('updateFinish')
                    break;
                case UpdateNotice.error:
                    setupdateEnable(true)
                    setstatusString('updateError')
                    break;
                default:
                    break;
            }
        })
        getCurrentVersion()
        getServerVersion()
        return ()=>{
            window.electronAPI.removeListener(updateNoticeListner)
        }
    },[])
    useEffect(()=>{
        if(currentVersion.length == 0 || latestVersion.length == 0)
            return
        if(currentVersion != latestVersion)
            setstatusString('updateAvailable')
        else
            setstatusString('latestVersion')

    },[latestVersion])
    return (
        <div>
            <Header>
                Update
            </Header>
            <MainArea>
                <UpdateLayout currentVersion={currentVersion} latestVersion={latestVersion} stateString={statusString}/>
            </MainArea>

            <Footer>
                <Button color='gray' type='small' onClick={() => {
                    if(updateMode == 'network')
                        navigate(-2)
                    else
                        navigate(-3)}}>Back</Button>
                <Button color='blue' type='small' enable={updateEnable} onClick={() => {
                    setupdateEnable(false)
                    if(updateTarget == 'resin'){
                        if(updateMode == 'network'){
                            window.electronAPI.resinUpdateRM()
                        }else{
                            if(!decodingUpdatePath){
                                setstatusString("fileError")
                                return
                            }
                            window.electronAPI.resinFileUpdateRM(decodingUpdatePath)
                        }
                    }else{
                        if(updateMode == 'network'){
                            window.electronAPI.softwareUpdateRM()
                        }else{
                            if(!decodingUpdatePath){
                                setstatusString("fileError")
                                return
                            }
                            window.electronAPI.softwareFileUpdateRM(decodingUpdatePath)
                        }
                    }
                }}>Update</Button>

            </Footer>
        </div>
    );
}
export default Update;