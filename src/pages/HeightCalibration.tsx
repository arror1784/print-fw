import React, { useState } from 'react';
import styled from 'styled-components'

import Button from '../components/Button';

import Footer from '../layout/Footer';
import Header from '../layout/Header';

import Calibration from '../components/Calibration';
import MainArea from '../layout/MainArea';
import { useNavigate } from 'react-router-dom';

function HeightCalibration(){
    const navigate = useNavigate()
    const [offsetValue, setOffsetValue] = useState<number>(6000);

    const [modalVisible, setModalVisible] = useState<boolean>(false);

    return (
        <div>
            <Header>
                Height Calibration
            </Header>
            <MainArea>
                <CalibrationArea>
                    <Calibration
                        title='Bed Height (um)'
                        value={offsetValue}
                        minValue={80}
                        maxValue={100}
                        sumValue1={1}
                        sumValue2={2}
                        onValueChange={(v : number) => {}}/>
                </CalibrationArea>

            </MainArea>            
            <Footer>
                <Button color='gray' type='small' onClick={() => {navigate(-1)}}>Back</Button>
                <Button color='blue' type='small' onClick={() => {setModalVisible(true)}}>Save Offset</Button>
            </Footer>
        </div>

            
    );
    // return (<div> <img src={wifiImg} sizes="(min-width: 600px) 200px, 50vw"/> </div>);
}
const CalibrationArea = styled.div`
    margin-top: -15px;
`
export default HeightCalibration;