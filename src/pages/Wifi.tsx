import React, { useEffect, useState } from 'react'
import Button from '../components/Button';

import Footer from '../layout/Footer';
import Header from '../layout/Header';
import {SelectList, SelectListModel} from '../components/SelectList';

import MainArea from '../layout/MainArea';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';

import { ModalInfoMainArea, ModalInfoTitle, ModalInfoValue } from '../layout/ModalInfo';
import { WifiCallbackType, WifiInfo } from '../../cpp/wifiModule';
import { IpcRendererEvent } from 'electron';
import Typing from '../layout/Typing';

import styled from 'styled-components'


function Wifi(){
    const navigate = useNavigate()

    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [selectWifiList, setselectWifiList] = useState<SelectListModel[]>([]);
    const [wifiList, setWifiList] = useState<WifiInfo[]>([]);
    const [passwd, setPasswd] = useState<string>("");
    const [isType,setIsType] = useState<boolean>(true);
    const [selectWifi, setSelectWifi] = useState<SelectListModel>({name:"",id:-1,});

    useEffect(() => {
        window.electronAPI.scanWifiRM()
        window.electronAPI.getWifiListTW().then((value:WifiInfo[]) => {
        

            var listModel : SelectListModel[] = selectWifiList
            value.forEach((value:WifiInfo,index:number)=>{
                listModel.push({name:value.ssid,id:index})
            })
            setselectWifiList(listModel)
            setWifiList(value)
        })
        window.electronAPI.onWifiNoticeMR((event:IpcRendererEvent, type:WifiCallbackType,value:number)=>{

        })
      return () => {}
    },[])

    const isSelected : boolean = selectWifi.id > -1
    const selectedWifi = isSelected ? wifiList[selectWifi.id] : undefined
    const isLocked : boolean = selectedWifi ? selectedWifi.flags : false


    return (
        <div>
            <Header>
                Select Wifi
            </Header>
            <MainArea>
                <SelectList selectListModel={selectWifiList} 
                    onContainerSelect={(model:SelectListModel) => {
                        setSelectWifi(model)
                    }} highlightId={selectWifi.id} extentions=".zip">
                    
                </SelectList>
            </MainArea>
            <Footer>
                <Button color='gray' type='small' onClick={() => {navigate(-1)}}>Back</Button>
                <Button color='blue' type='small' onClick={() => {setModalVisible(true)}}>Select</Button>
            </Footer>
    
            <Modal visible={modalVisible} onBackClicked={() => {setModalVisible(false)}} onSelectClicked={() => {
    
            }}>
                <ModalInfoMainArea>
                    <ModalInfoTitle text="WiFi name"/>
                    <ModalInfoValue text={selectedWifi ? selectedWifi.ssid : ""}/>
                    {
                        isLocked ? <ModalInfoTitle text="PassWord"/> : <div></div>
                    }
                    {
                        isLocked ? <PassWD type={"password"} placeholder={"password"} value={passwd} onFocus={()=>{setIsType(true)}}></PassWD> : <div></div>
                    }
                </ModalInfoMainArea>
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