import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styled from 'styled-components'

import Button from '../components/Button';
import Footer from '../layout/Footer';

import Header from '../layout/Header';
import MainArea from '../layout/MainArea';
import UpdateLayout from '../layout/UpdateLayout';


function Update(){
    const navigate = useNavigate()
    

    return (
        <div>
            <Header>
                Update
            </Header>
            <MainArea>
                <UpdateLayout currentVersion='' latestVersion='' stateString='updateCheck'/>
            </MainArea>

            <Footer>
                <Button color='gray' type='small' onClick={() => {navigate(-2)  }}>Back</Button>
                <Button color='blue' type='small' onClick={() => {console.log("back btn clicked")}}>Update</Button>

            </Footer>
        </div>
    );
}
export default Update;