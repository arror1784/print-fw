import React, { useState } from 'react';
import styled from 'styled-components'

import Button from '../components/Button';

import ImageButton from '../components/ImageButton';
import SelectList from '../components/SelectList';

import Footer from '../layout/Footer';
import Modal from '../components/Modal';
import ListContainer from '../components/ListContainer';
import Header from '../layout/Header';

import arrowDirImg from '../assets/arrow-dir.png'
import MainArea from '../layout/MainArea';

function Model(){

    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [filePath, setFilePath] = useState<string>("hello world");

    const rootPath = "";

    return (
        <div>
            <Header>
                Select a file to print
            </Header>
            <MainArea>
                <ParentArea>
                    <ParentDirButton>
                        <ParentDirImg width='20px' src={arrowDirImg}></ParentDirImg>
                    </ParentDirButton>
                    <CurrentDirText>hello world</CurrentDirText>
                </ParentArea>

                <SelectList height={165}>

                    <ListContainer text='파일 하나'/>
                    <ListContainer text='파일 둘'/>
                    <ListContainer text='model'/>
                    <ListContainer text='resin'/>
                    <ListContainer text='asdasd'/>
                    <ListContainer text='resin'/>
                    <ListContainer text='asdasd'/>
                    <ListContainer text='resin'/>
                    <ListContainer text='asdasd'/>
                    <ListContainer text='resin'/>
                    <ListContainer text='asdasd'/>
                </SelectList>
            </MainArea>

            
            <Footer>
                <Button color='gray' type='small' onClick={() => {console.log("back btn clicked")}}>Back</Button>
                <Button color='blue' type='small' onClick={() => {console.log("next btn clicked"); setModalVisible(true)}}>Select</Button>
            </Footer>

            <Modal visible={modalVisible} onBackClicked={() => {setModalVisible(false)}}>
                {filePath}
            </Modal>
        </div>

            
    );
    // return (<div> <img src={wifiImg} sizes="(min-width: 600px) 200px, 50vw"/> </div>);
}
export const ParentArea = styled.div`
    display: flex;
    width: 450px;
    height: 40px;
    background-color: #FFFFFF;
    align-items: center;
    margin-bottom: 10px;
`
export const ParentDirButton = styled.div`
    width: 38px;
    height: 34px;

    background-color: #B6CDDC;
    border-style: none;
    border-radius: 8px;

    margin: 5px;
    /* padding: 5px; */
`
export const ParentDirImg = styled.img`
    margin: 5px;
`
export const CurrentDirText = styled.div`
    color: #474747;
    margin-left: 5px;
    font-size: 22px;
`

export default Model;