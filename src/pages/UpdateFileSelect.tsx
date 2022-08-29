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
            WiFi Update
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
                }} highlightId={selectFile.id} extentions=".">
                
            </SelectList> */}
        </MainArea>
        <Footer>
            <Button color='gray' type='small' onClick={() => {navigate(-1)}}>Back</Button>
            <Button color='blue' type='small' onClick={() => {navigate('update')}}>Select</Button>
        </Footer>
    </MainArea>);
    // return (<div> <img src={wifiImg} sizes="(min-width: 600px) 200px, 50vw"/> </div>);
}
export default UpdateFileSelect;