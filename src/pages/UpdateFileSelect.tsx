import React, { useEffect, useRef, useState } from 'react'
import Button from '../components/Button';

import styled from 'styled-components'

import Footer from '../layout/Footer';
import Header from '../layout/Header';
import {SelectList, SelectListModel} from '../components/SelectList';
import arrowDirImg from '../assets/arrow-dir.png'
import MainArea from '../layout/MainArea';
import { useNavigate, useParams } from 'react-router-dom';

import {encode} from 'js-base64'
import { ModalNotice } from '../layout/ModalInfo';
import Modal from '../components/Modal';

interface DirOrFile extends SelectListModel{
    isDir:boolean;
    path:string;
}

function UpdateFileSelect(){
    const navigate = useNavigate()
    const { updateTarget } = useParams()

    const [dirPath, setDirPath] = useState<string>("");
    const [fileList, setFileList] = useState<DirOrFile[]>([]);
    const [selectFile, setSelectFile] = useState<DirOrFile>({name:"",isDir:false,path:"",id:-1});
    const [storageDisconnectModalVisible, setstorageDisconnectModalVisible] = useState(false)

    const findRootPathTimer = useRef<NodeJS.Timer>()
    const rootPath = useRef("")

    const findRootPath = ()=>{
        window.electronAPI.getUSBPathTW().then((value:string)=>{
            if(value == ""){
                if(rootPath.current.length != 0){
                    if(findRootPathTimer.current)
                        clearInterval(findRootPathTimer.current)
                    setstorageDisconnectModalVisible(true)
                }
                return
            }
            if(rootPath.current == value)
                return
            rootPath.current = value
            setDirPath(value)
        })
    }
    useEffect(()=>{
        findRootPathTimer.current = setInterval(findRootPath,500)
        return ()=>{
        }
    },[])

    useEffect(() => {
        window.electronAPI.readDirTW(dirPath).then(
            (valueArr : DirOrFile[]) => {
                let valueArrCopy = valueArr.filter((value:DirOrFile) => {return value.name.endsWith("updateFile") || value.isDir})
                valueArrCopy.sort((a:DirOrFile,b:DirOrFile) : number  => {
                    if(a.isDir && b.isDir)
                        return 0
                    else
                        return a.isDir ? -1 : 1
                })
                setFileList(valueArrCopy)
            })
    }, [dirPath])

    return (
    <div>
        <Header>
            Select a file (*.updateFile)
        </Header>
        <MainArea>

            <ParentArea>
                <ParentDirButton onClick={() => {
                    if(dirPath !== rootPath.current)
                        setDirPath(dirPath.slice(0,dirPath.lastIndexOf("/")))
                }}>
                    <ParentDirImg width='20px' src={arrowDirImg}></ParentDirImg>
                </ParentDirButton>
                <CurrentDirText>{
                    dirPath !== rootPath.current &&
                        dirPath.split('/').pop()
                } </CurrentDirText>
            </ParentArea>
            <SelectList height={165} selectListModel={fileList} 
                onContainerSelect={(model:SelectListModel) => {
                    const value = model as DirOrFile
                    if(value.isDir){
                        setDirPath(value.path)
                        setSelectFile({name:"",isDir:false,path:"",id:-1})
                    }
                    else
                        setSelectFile(value)
                }} highlightId={selectFile.id}>
                
            </SelectList>
        </MainArea>
        <Footer>
            <Button color='gray' type='small' onClick={() => {navigate(-2)}}>Back</Button>
            <Button color='blue' type='small' onClick={() => {
                console.log('/update/' + updateTarget + '/usb/' + encode(selectFile.path))
                navigate('/update/' + updateTarget + '/usb/' + encode(selectFile.path))}}>Select</Button>
        </Footer>
                    
        <Modal visible={storageDisconnectModalVisible} onBackClicked={() => {navigate(-1)}} selectVisible={false}>
            <ModalNotice text={"USB 연결이 끊겼습니다."}/>
        </Modal>
    </div>);
}

const ParentArea = styled.div`
    display: flex;
    width: 450px;
    height: 40px;
    background-color: #FFFFFF;
    align-items: center;
    margin-bottom: 10px;
`
const ParentDirButton = styled.div`
    width: 38px;
    height: 34px;

    background-color: #B6CDDC;
    border-style: none;
    border-radius: 8px;

    margin: 5px;
    /* padding: 5px; */
`
const ParentDirImg = styled.img`
    margin: 5px;
`
const CurrentDirText = styled.div`
    color: #474747;
    margin-left: 5px;
    font-size: 22px;
`

export default UpdateFileSelect;