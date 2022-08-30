import React, { useEffect, useRef, useState } from 'react'
import Button from '../components/Button';

import Footer from '../layout/Footer';
import Header from '../layout/Header';
import {SelectList, SelectListModel} from '../components/SelectList';

import MainArea from '../layout/MainArea';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';

import { ModalInfoMainArea, ModalInfoTitle, ModalInfoValue } from '../layout/ModalInfo';
import { IpcRendererEvent } from 'electron';

import styled from 'styled-components'

enum WifiCallbackType{
    ListUpdate = 0,
    StateChange = 1,
    ScanFail = 2,
    AssocFail = 3,
    TryAssociate = 4
}
interface WifiInfo{
    ssid:string;
    bssid:string;

    connected:boolean;

    flags:boolean;
    freq:number;
    signal_level:number;
}
interface WifiListModel extends WifiInfo {
    id: number;
    name: string;
}

enum ConnectingNotice{
    TryAssociate = "Try To Connect",
    AssociateFail = "Fail To Connect",
    Connect = "Connect",
    DisConnect = "Disconnect",
}


function Wifi(){
    const navigate = useNavigate()

    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [connectingModalVisible, setConnectingModalVisible] = useState<boolean>(false);
    const [connectingNotice, setConnectingNotice] = useState<string>("");

    const [wifiContainerList, setWifiContainerList] = useState<WifiListModel[]>([]);
    const [selectContainerWifi, setSelectContainerWifi] = useState<WifiListModel | undefined>();
    const [currentWifi, setCurrentWifi] = useState<WifiInfo | undefined>();

    useEffect(() => {
        window.electronAPI.scanWifiRM()

        const wifiNoticeListener = window.electronAPI.onWifiNoticeMR((event:IpcRendererEvent, type:WifiCallbackType,value:number)=>{
            console.log(type,value)
            switch (type) {
                case WifiCallbackType.ListUpdate:
                    window.electronAPI.getWifiListTW().then((value:WifiInfo[]) => {
                        var listModel : WifiListModel[] = []
                        value.forEach((v:WifiInfo,i:number)=>{
                            listModel.push({...v,name:v.ssid,id:i})
                        })
                        setWifiContainerList([...listModel])
                    })
                    break;
                case WifiCallbackType.StateChange:
                    window.electronAPI.getCurrentWifiStatusTW().then((value:WifiInfo)=>{
                        console.log(value)
                        setConnectingModalVisible(true)
                        if(value.connected){
                            setCurrentWifi(value)
                            setConnectingNotice(ConnectingNotice.Connect +" " +value.ssid)
                            return
                        }else{
                            setCurrentWifi(undefined)
                            setConnectingNotice(ConnectingNotice.DisConnect)
                        }
                    })
                    break;
                case WifiCallbackType.TryAssociate:
                    setConnectingModalVisible(true)
                    setModalVisible(false)
                    setConnectingNotice(ConnectingNotice.TryAssociate)
                    break;
                case WifiCallbackType.AssocFail:
                    setConnectingModalVisible(true)
                    setModalVisible(false)
                    setConnectingNotice(ConnectingNotice.AssociateFail)
                    break;
                default:
                    break;
            }
        })
      return () => {
        window.electronAPI.removeListener(wifiNoticeListener)
      }
    },[])
    useEffect(()=>{
        window.electronAPI.getCurrentWifiStatusTW().then((value:WifiInfo)=>{
            let list = wifiContainerList
            console.log(value)
            if(!value.connected){
                setCurrentWifi(undefined)
                return
            }
            list.forEach((v:WifiListModel,i:number)=>{
                if(v.bssid == value.bssid){
                    if(list[i].name.startsWith("Current : "))
                        return
                    setSelectContainerWifi(list[i])
                    list[i].name = "Current : " + list[i].name
                }
            })
            setCurrentWifi(value)
            setWifiContainerList(list)
        })
    },[wifiContainerList])

    const isLocked : boolean = selectContainerWifi ? selectContainerWifi.flags : false

    const ref = useRef<HTMLInputElement | null>(null)

    return (
        <div>
            <Header>
                Select Wifi
            </Header>
            <MainArea>
                <SelectList selectListModel={wifiContainerList} 
                    onContainerSelect={(model:SelectListModel) => {
                        setSelectContainerWifi(model as WifiListModel)
                    }} highlightId={selectContainerWifi ? selectContainerWifi.id : -1}>
                </SelectList>
            </MainArea>
            <Footer>
                <Button color='gray' type='small' onClick={() => {navigate(-1)}}>Back</Button>
                <Button color='blue' type='small' onClick={() => {setModalVisible(true)}}>Select</Button>
            </Footer>
            {
                currentWifi?.bssid == selectContainerWifi?.bssid ? 
                <Modal visible={modalVisible} selectString={"Disconnect"} onBackClicked={() => {setModalVisible(false)}} onSelectClicked={() => {
                        window.electronAPI.disconnectWifiRM()
                        setModalVisible(false)
                }}>
                    <ModalInfoMainArea>
                        <ModalInfoTitle text="WiFi name"/>
                        <ModalInfoValue text={selectContainerWifi ? selectContainerWifi.ssid : ""}/>
                    </ModalInfoMainArea>
                </Modal>
                : <Modal visible={modalVisible} selectString={"Connect"} onBackClicked={() => {setModalVisible(false)}} onSelectClicked={() => {
                    if(ref.current && selectContainerWifi){
                        window.electronAPI.connectWifiRM(selectContainerWifi.ssid,selectContainerWifi.bssid,ref.current.defaultValue)
                        setModalVisible(false)
                    }
                }}>
                    <ModalInfoMainArea>
                        <ModalInfoTitle text="WiFi name"/>
                        <ModalInfoValue text={selectContainerWifi ? selectContainerWifi.ssid : ""}/>
                        {
                            isLocked ? <ModalInfoTitle text="PassWord"/> : <div></div>
                        }
                        {
                            isLocked ? <PassWD ref={ref} type={"password"} placeholder={"password"}></PassWD> : <div></div>
                        }
                    </ModalInfoMainArea>
                </Modal>
            }
                <Modal visible={connectingModalVisible} selectVisible={false} onBackClicked={() => {setConnectingModalVisible(false)}}>
                        <ModalInfoTitle text={connectingNotice}/> 
                </Modal>
        </div>);
}
const PassWD = styled.input`
    border-color: black;
    width: 210px;
    font-size: 20px;
    height: 30px;
    margin-right: 10px;

`

export default Wifi;