import React, { useState } from 'react';

import ImageButton from '../components/ImageButton';

import wifiImg from '../assets/wifi.png';
import calibrationImg from '../assets/calibration.png';
import updateImg from '../assets/update.png';
import lightImg from '../assets/light.png';

import Button from '../components/Button';
import Footer from '../layout/Footer';

import OptionLayout from '../layout/OptionLayout';
import Modal from '../components/Modal';


function Setting(){

    

    return (
        <div>
            <OptionLayout>
                <ImageButton src={calibrationImg} type='middle' color='gray'> Height Calibration </ImageButton>
                <ImageButton src={lightImg}  type='middle' color='gray'> LED Calibartion </ImageButton>
                <ImageButton src={updateImg}  type='middle' color='gray'> Update </ImageButton>
                <ImageButton src={wifiImg}  type='middle' color='gray'> WiFi </ImageButton>
            </OptionLayout>

            <Footer>
                <Button color='gray' type='small' onClick={() => {console.log("back btn clicked")}}>Back</Button>
            </Footer>
        </div>
    );
}

export default Setting;