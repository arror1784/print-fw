import React, { useEffect, useState } from 'react';
import styled from 'styled-components'

import Button from '../components/Button';

import ImageButton from '../components/ImageButton';
import {SelectList, SelectListModel} from '../components/SelectList';

import Footer from '../layout/Footer';
import Header from '../layout/Header';

import arrowDirImg from '../assets/arrow-dir.png'
import MainArea from '../layout/MainArea';
import { useNavigate } from 'react-router-dom';

import { osName,OsTypes } from 'react-device-detect';

import {encode} from 'base-64'

interface DirOrFile extends SelectListModel{
    isDir:boolean;
    path:string;
}

const rootPath = osName === OsTypes.Windows ? "./temp/USB" : "/home/jsh/USBtest";

function Model(){

    const navigate = useNavigate()

    const [dirPath, setDirPath] = useState<string>(rootPath);
    const [fileList, setFileList] = useState<DirOrFile[]>([]);
    const [selectFile, setSelectFile] = useState<DirOrFile>({name:"",isDir:false,path:"",id:-1});

    useEffect(() => {
        window.electronAPI.readDirTW(dirPath).then(
            (valueArr : DirOrFile[]) => {
                let valueArrCopy = valueArr.filter((value:DirOrFile) => {return value.name.endsWith("zip") || value.isDir})
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
                Select a file to print
            </Header>
            <MainArea>
                <ParentArea>
                    <ParentDirButton onClick={() => {
                        if(dirPath !== rootPath)
                            setDirPath(dirPath.slice(0,dirPath.lastIndexOf("/")))
                    }}>
                        <ParentDirImg width='20px' src={arrowDirImg}></ParentDirImg>
                    </ParentDirButton>
                    <CurrentDirText>{
                        dirPath !== rootPath &&
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
                    }} highlightId={selectFile.id} extentions=".zip">
                    
                </SelectList>
            </MainArea>

            
            <Footer>
                <Button color='gray' type='small' onClick={() => {navigate(-1)}}>Back</Button>
                <Button color='blue' type='small' onClick={() => {
                    if(selectFile.name != "") navigate(`/material/${encode(selectFile.path)}`)}}>Select</Button>
            </Footer>


        </div>

            
    );
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

export default Model;