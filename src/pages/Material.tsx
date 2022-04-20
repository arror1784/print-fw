import React from 'react'
import Button from '../components/Button';

import Footer from '../layout/Footer';
import Header from '../layout/Header';
import SelectList from '../components/SelectList';
import ListContainer from '../components/ListContainer';
import MainArea from '../layout/MainArea';

function Material(){
    return (<div>
        <Header>
            Select a printing material
        </Header>
        <MainArea>
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
        </MainArea>
        <Footer>
            <Button color='gray' type='small' onClick={() => {console.log("back btn clicked")}}>Back</Button>
            <Button color='blue' type='small' onClick={() => {console.log("next btn clicked")}}>Select</Button>
        </Footer>
        </div>);
    // return (<div> <img src={wifiImg} sizes="(min-width: 600px) 200px, 50vw"/> </div>);
}
export default Material;