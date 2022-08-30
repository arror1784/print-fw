import React, { useEffect, useState } from 'react'
import Button from '../components/Button';

import styled from 'styled-components'

import Footer from '../layout/Footer';
import Header from '../layout/Header';
import {SelectList, SelectListModel} from '../components/SelectList';
import ListContainer from '../components/ListContainer';
import MainArea from '../layout/MainArea';
import { useNavigate, useParams } from 'react-router-dom';
import { osName, OsTypes } from 'react-device-detect';

import {encode} from 'base-64'

interface DirOrFile extends SelectListModel{
    isDir:boolean;
    path:string;
}

const rootPath = osName === OsTypes.Windows ? "./temp/USB" : "/home/jsh/USBtest";

function UpdateFileSelect(){
    const navigate = useNavigate()
    const { updateTarget } = useParams()

    const [dirPath, setDirPath] = useState<string>(rootPath);
    const [fileList, setFileList] = useState<DirOrFile[]>([]);
    const [selectFile, setSelectFile] = useState<DirOrFile>({name:"",isDir:false,path:"",id:-1});

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
    <MainArea>
        <Header>
            Select a file (*.updateFile)
        </Header>
        <MainArea>
            <SelectList selectListModel={fileList} 
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
            <Button color='blue' type='small' onClick={() => {navigate('/update/' + updateTarget + '/usb/' + encode(selectFile.path))}}>Select</Button>
        </Footer>
    </MainArea>);
}
export default UpdateFileSelect;