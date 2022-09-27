import React, { useEffect, useState } from 'react'
import Button from '../components/Button';

import Footer from '../layout/Footer';
import Header from '../layout/Header';
import {SelectList, SelectListModel} from '../components/SelectList';

import MainArea from '../layout/MainArea';
import { useNavigate, useParams } from 'react-router-dom';
import Modal from '../components/Modal';

import {decode} from 'js-base64'
import { ModalInfoMainArea, ModalInfoTitle, ModalInfoValue, ModalNotice } from '../layout/ModalInfo';
import { IpcRendererEvent } from 'electron';

function Material(){
    const navigate = useNavigate()

    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [errorModalVisible, seterrorModalVisible] = useState(false)
    const [errorMessage, seterrorMessage] = useState("")
    const [resinList, setResinList] = useState<SelectListModel[]>([]);
    const [isCustom, setIsCustom] = useState<boolean>(false);
    const [selectResin, setSelectResin] = useState<SelectListModel>({name:"",id:-1});
    const [selectFileName,setSelectFileName] = useState<string>("")
    const [selectFilePath,setSelectFilePath] = useState<string>("")
    const [layerheight,setLayerHeight] = useState<number>(0)

    const { selectPath } = useParams()

    useEffect(() => {

        window.electronAPI.resinListTW().then((value:string[]) => {
        
            var listModel : SelectListModel[] = resinList
            value.forEach((value:string,index:number)=>{
                listModel.push({name:value,id:index + 1})
            })
            setResinList(listModel)  
        })
        const startErrorListener = window.electronAPI.onStartErrorMR((event:IpcRendererEvent,error:string)=>{
            seterrorModalVisible(true)
            seterrorMessage(error)
            setModalVisible(false)
        })
        if(selectPath){
            window.electronAPI.isCustomTW(decode(selectPath)).then((value:boolean) => {
                if(!value)
                    return
                var listModel : SelectListModel[] = resinList
                listModel.unshift({name:"custom",id:0})
                setResinList(listModel)  
            })
            setSelectFilePath(decode(selectPath))
            let nameArr = decode(selectPath).split('/')
            setSelectFileName(nameArr[nameArr.length - 1])
        }
        
      return () => {
        window.electronAPI.removeListener(startErrorListener)
      }
    },[])
    useEffect(()=>{
        window.electronAPI.getLayerHeightTW(selectFilePath).then((value:number) => {
            setLayerHeight(value)
        })
    },[selectFilePath])

    return (
    <div>
        <Header>
            Select a printing material
        </Header>
        <MainArea>
            <SelectList selectListModel={resinList} 
                onContainerSelect={(model:SelectListModel) => {
                    setSelectResin(model)
                }} highlightId={selectResin.id}>
                
            </SelectList>
        </MainArea>
        <Footer>
            <Button color='gray' type='small' onClick={() => {navigate(-1)}}>Back</Button>
            <Button color='blue' type='small' onClick={() => {setModalVisible(true)}}>Select</Button>
        </Footer>
        <Modal visible={modalVisible} onBackClicked={() => {setModalVisible(false)}} onSelectClicked={() => {
            window.electronAPI.printStartRM(selectFilePath,selectResin.name)
        }}>
            <ModalInfoMainArea>
                <ModalInfoTitle text="File Name"/>
                <ModalInfoValue text={selectFileName}/>
                <ModalInfoTitle text='Material'/>
                <ModalInfoValue text={selectResin.name}/>
                <ModalInfoTitle text='Layer Height'/>
                <ModalInfoValue text={`${layerheight}mm/layer`}/>
            </ModalInfoMainArea>
        </Modal>
        <Modal visible={errorModalVisible} onBackClicked={() => {seterrorModalVisible(false)}} selectVisible={false}>
            <ModalNotice text={errorMessage}/>
        </Modal>
    </div>);
}
export default Material;