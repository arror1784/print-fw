import React, { useState } from 'react';

import ImageButton from '../components/ImageButton';

import wifiImg from '../assets/wifi.png';
import calibrationImg from '../assets/calibration.png';
import updateImg from '../assets/update.png';
import lightImg from '../assets/light.png';

import Button from '../components/Button';
import Footer from '../layout/Footer';

import OptionLayout from '../layout/OptionLayout';
import { useNavigate } from 'react-router-dom';


function Setting(){

    const navigate = useNavigate()


    return (
        <div>
            <OptionLayout>
                <ImageButton src={calibrationImg} type='middle' color='gray' onClick={()=>{navigate('/calibration/height')}}> Height Calibration </ImageButton>
                <ImageButton src={lightImg}  type='middle' color='gray' onClick={()=>{navigate('/calibration/led')}}> LED Calibartion </ImageButton>
                <ImageButton src={updateImg}  type='middle' color='gray' onClick={()=>{navigate('/updateSetting')}}> Update </ImageButton>
                <ImageButton src={wifiImg}  type='middle' color='gray' onClick={()=>{navigate('/wifi')}}> WiFi </ImageButton>
            </OptionLayout>

            <Footer>
                <Button color='gray' type='small' onClick={() => {navigate(-1)}}>Back</Button>
                <Button color='gray' type='small' visible={false}></Button>
            </Footer>
        </div>
    );
}

export default Setting;