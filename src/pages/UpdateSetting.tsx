import React, { useState } from 'react';

import ImageButton from '../components/ImageButton';

import softwareImg from '../assets/download.png';
import resinImg from '../assets/fill.png';
import factoryResetImg from '../assets/factory.png'

import Button from '../components/Button';
import Footer from '../layout/Footer';

import OptionLayout from '../layout/OptionLayout';
import { useNavigate } from 'react-router-dom';


function UpdateSetting(){

    const navigate = useNavigate()

    return (
        <div>
            <OptionLayout>
                <ImageButton src={resinImg} type='middle' color='gray' onClick={()=>{navigate('resin')}}> Resin </ImageButton>
                <ImageButton src={softwareImg}  type='middle' color='gray' onClick={()=>{navigate('software')}}> Software </ImageButton>
                <ImageButton src={factoryResetImg}  type='middle' color='gray' onClick={()=>{navigate('/factoryReset')}}> Factory Reset </ImageButton>
            </OptionLayout>

            <Footer>
                <Button color='gray' type='small' onClick={() => {navigate(-1)}}>Back</Button>
                <Button color='gray' type='small' visible={false}></Button>
            </Footer>
        </div>
    );
}

export default UpdateSetting;