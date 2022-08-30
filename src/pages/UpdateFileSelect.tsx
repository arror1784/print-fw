import React from 'react'
import Button from '../components/Button';

import styled from 'styled-components'

import Footer from '../layout/Footer';
import Header from '../layout/Header';
import {SelectList} from '../components/SelectList';
import ListContainer from '../components/ListContainer';
import MainArea from '../layout/MainArea';
import { useNavigate } from 'react-router-dom';

function UpdateFileSelect(){
    const navigate = useNavigate()
    return (
    <MainArea>
        <Header>
            Select a file (*.updateFile)
        </Header>
        <MainArea>
            {/* <SelectList selectListModel={fileList} 
                onContainerSelect={(model:SelectListModel) => {
                    const value = model as DirOrFile
                    if(value.isDir){
                        setDirPath(value.path)
                        setSelectFile({name:"",isDir:false,path:"",id:-1})
                    }
                    else
                        setSelectFile(value)
                }} highlightId={selectFile.id} extentions=".updateFile">
                
            </SelectList> */}
        </MainArea>
        <Footer>
            <Button color='gray' type='small' onClick={() => {navigate(-2)}}>Back</Button>
            <Button color='blue' type='small' onClick={() => {navigate('/update/' + updateTarget + '/usb/' + encode(selectFile.path))}}>Select</Button>
        </Footer>
    </MainArea>);
}
export default UpdateFileSelect;