import React, { useState } from 'react';

import ImageButton from '../components/ImageButton';

import networkImg from '../assets/network.png';
import usbImg from '../assets/USB.png';

import Button from '../components/Button';
import Footer from '../layout/Footer';

import OptionLayout from '../layout/OptionLayout';
import { useNavigate, useParams } from 'react-router-dom';


function UpdateModeSetting(){

    const navigate = useNavigate()
    const { updateTarget } = useParams()

    return (
        <div>
            <OptionLayout>
                <ImageButton src={networkImg} type='middle' color='gray' onClick={()=>{navigate('/update/' + updateTarget + '/network')}}> Network </ImageButton>
                <ImageButton src={usbImg}  type='middle' color='gray' onClick={()=>{navigate('usb')}}> USB </ImageButton>
            </OptionLayout>

            <Footer>
                <Button color='gray' type='small' onClick={() => {navigate(-2)}}>Back</Button>
                <Button color='gray' type='small' visible={false}></Button>
            </Footer>
        </div>
    );
}

export default UpdateModeSetting;