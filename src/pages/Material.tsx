import React, { useEffect, useState } from 'react'
import Button from '../components/Button';

import Footer from '../layout/Footer';
import Header from '../layout/Header';
import {SelectList, SelectListModel} from '../components/SelectList';

import MainArea from '../layout/MainArea';
import { useNavigate, useParams } from 'react-router-dom';
import Modal from '../components/Modal';

import {decode} from 'base-64'
function Material(){
    const navigate = useNavigate()

    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [resinList, setResinList] = useState<SelectListModel[]>([]);
    const [selectResin, setSelectResin] = useState<SelectListModel>({name:"",id:-1});

    const { selectPath } = useParams()

    useEffect(() => {

        window.electronAPI.resinListTW().then((value:string[]) => {
        
            var listModel : SelectListModel[] = []
            value.forEach((value:string,index:number)=>{
                listModel.push({name:value,id:index})
            })
            console.log(listModel)
            setResinList(listModel)  
        })    
      return () => {}
    },[])

    return (
    <div>
        <Header>
            Select a printing material
        </Header>
        <MainArea>
            <SelectList selectListModel={resinList} 
                onContainerSelect={(model:SelectListModel) => {
                    setSelectResin(model)
                }} highlightId={selectResin.id} extentions=".zip">
                
            </SelectList>
        </MainArea>
        <Footer>
            <Button color='gray' type='small' onClick={() => {navigate(-1)}}>Back</Button>
            <Button color='blue' type='small' onClick={() => {setModalVisible(true)}}>Select</Button>
        </Footer>
        <Modal visible={modalVisible} onBackClicked={() => {setModalVisible(false)}} onSelectClicked={() => {
            window.electronAPI.printStartRM(decode(selectPath as string),selectResin.name)
        }}>
            {/* {filePath} */}
        </Modal>
    </div>);
}
export default Material;