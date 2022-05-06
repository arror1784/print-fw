import React, { useState } from 'react';
import styled from 'styled-components'

import Button from '../components/Button';

import Footer from '../layout/Footer';
import Header from '../layout/Header';

import Calibration from '../components/Calibration';
import MainArea from '../layout/MainArea';

function HeightCalibration(){

    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [filePath, setFilePath] = useState<string>("hello world");

    const rootPath =     "";

    return (
        <div>
            <Header>
                Height Calibration
            </Header>
            <MainArea>
                <CalibrationArea>
                    <Calibration
                        title='Bed Height (um)'
                        value={6000}
                        minValue={0}
                        maxValue={100}
                        sumValue1={1}
                        sumValue2={2}
                        onSum={(v : number) => {}}/>
                </CalibrationArea>

            </MainArea>            
            <Footer>
                <Button color='gray' type='small' onClick={() => {console.log("back btn clicked")}}>Back</Button>
                <Button color='blue' type='small' onClick={() => {console.log("next btn clicked"); setModalVisible(true)}}>Save Offset</Button>
            </Footer>
        </div>

            
    );
    // return (<div> <img src={wifiImg} sizes="(min-width: 600px) 200px, 50vw"/> </div>);
}
export const CalibrationArea = styled.div`
    margin-top: -15px;
`
export default HeightCalibration;