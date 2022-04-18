import React, { useState } from 'react';
import classNames from 'classnames';
import Button from '../components/Button';

import ImageButton from '../components/ImageButton';
import SelectList from '../components/SelectList';

import './Model.scss';
import Footer from '../layout/Footer';
import Modal from '../components/Modal';

interface ListContainerProps{
    text: string;
}

function ListContainer({text}:ListContainerProps){
    return(
        <div className='list-container'>
            {text}
        </div>
    );
}

function Model(){

    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [filePath, setFilePath] = useState<string>("hello world");

    const rootPath = "";

    return (
        <div>
            <SelectList>
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

export default Model;