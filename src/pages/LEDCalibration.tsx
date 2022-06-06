import React, { useState } from 'react';
import styled from 'styled-components'

import Button from '../components/Button';

import Footer from '../layout/Footer';
import Header from '../layout/Header';

import Calibration from '../components/Calibration';
import MainArea from '../layout/MainArea';
import { useNavigate } from 'react-router-dom';

function LEDCalibration(){
    const navigate = useNavigate()
    const [ledValue, setLedValue] = useState<number>(100);

    const rootPath = "";

    return (
        <div>
            <Header>
                LED Calibration
            </Header>
            <MainArea>
                <CalibrationArea>
                    <Calibration
                        title='LED (%)'
                        value={Number((ledValue * 100).toFixed()) / 100}
                        minValue={80}
                        maxValue={120}
                        sumValue1={1}
                        sumValue2={0.1}
                        onValueChange={(v : number) => {
                            setLedValue(v)
                        }}/>
                </CalibrationArea>

            </MainArea>            
            <Footer>
                <Button color='gray' type='small' onClick={() => {navigate(-1)}}>Back</Button>
                <Button color='blue' type='small' onClick={() => {}}>Save Offset</Button>
            </Footer>
        </div>

            
    );
    // return (<div> <img src={wifiImg} sizes="(min-width: 600px) 200px, 50vw"/> </div>);
}
export const CalibrationArea = styled.div`
    margin-top: -15px;
`
export default LEDCalibration;