import React, { useState } from 'react';

import styled from 'styled-components'

import Button from '../components/Button';
import Footer from '../layout/Footer';

import Modal from '../components/Modal';
import Header from '../layout/Header';
import MainArea from '../layout/MainArea';


function Update(){

    

    return (
        <div>
            <Header>
                Update
            </Header>
            <MainArea>
                <UpdateInfo>Network not connected</UpdateInfo>
                <VersionInfoArea>
                    <VersionText>Current Version</VersionText>
                    <VersionValue>1.4.1</VersionValue>
                    <VersionText>Latest version</VersionText>
                    <VersionValue>2.1.1</VersionValue>
                </VersionInfoArea>
            </MainArea>

            <Footer>
                <Button color='gray' type='small' onClick={() => {console.log("back btn clicked")}}>Back</Button>
                <Button color='blue' type='small' onClick={() => {console.log("back btn clicked")}}>Update</Button>

            </Footer>
        </div>
    );
}
export const UpdateInfo = styled.div`
    color: #474747;
    font-size:23px;

    align-self: flex-start;
    margin-left: 30px;
    margin-bottom: 10px;
    margin-top: -15px;
`
export const VersionInfoArea = styled.div`
    display: grid;

    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;

    justify-items: start;
    align-items: center;

    background-color: #ffffff;
    width: 450px;
    height: 115px;
    border-radius: 8px;

`
export const VersionText = styled.div`
    color: #474747;
    font-size:23px;
    margin-left: 15px;
`
export const VersionValue = styled.div`
    color: #474747;
    font-size:23px;
    font-weight: bold
`
export default Update;