import { decode } from 'base-64';
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
    const [currentVersion, setcurrentVersion] = useState("")
    const [latestVersion, setlatestVersion] = useState("")
    const [statusString, setstatusString] = useState<UpdateState>('updateCheck')

    const decodingUpdatePath = updatePath && decode(updatePath)

    const getCurrentVersion = ()=>{
        if(updateTarget == "resin"){
            if(updateMode == "network"){
                window.electronAPI.getCurrentLatestResinVersionTW().then((v:Date)=>{
                    setcurrentVersion(v.toLocaleString())
                })
            }
        }else{
            if(updateMode == "network"){
                window.electronAPI.getCurrentVersionTW().then((v:string)=>{
                    setcurrentVersion(v)
                })
            }
        }
    }
    const getServerVersion = () => {
        if(updateTarget == "resin"){
            if(updateMode == "network"){
                window.electronAPI.checkAvailableToResinUpdateNetworkTW().then((v:Date|null)=>{
                    if(v)
                        setlatestVersion(v.toLocaleString())
                    else
                        setstatusString('networkError')
                })
            }else{
                // resin usb
            }
        }else{
            if(updateMode == "network"){
                window.electronAPI.getServerVersionTW().then((v:string|null)=>{
                    if(v)
                        setlatestVersion(v)
                    else
                        setstatusString('networkError')
                })
            }else{
                //SW usb
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
                    setstatusString('updateFinish')
                    break;
                case UpdateNotice.error:
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
                <Button color='blue' type='small' onClick={() => {
                    if(updateTarget == 'resin'){
                        if(updateMode == 'network'){
                            window.electronAPI.resinUpdateRM()
                        }else{

                        }
                    }else{
                        if(updateMode == 'network'){
                            window.electronAPI.softwareUpdateRM()
                        }else{

                        }
                    }
                }}>Update</Button>

            </Footer>
        </div>
    );
}
export default Update;