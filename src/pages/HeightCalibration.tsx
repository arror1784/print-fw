import React, { useEffect, useState } from 'react';
import styled from 'styled-components'

import Button from '../components/Button';

import Footer from '../layout/Footer';
import Header from '../layout/Header';

import Calibration from '../components/Calibration';
import MainArea from '../layout/MainArea';
import { useNavigate } from 'react-router-dom';


enum MoveMotorCommand{
    GoHome="GoHome",
    AutoHome="AutoHome",
    MoveMicro="MoveMicro",
    MoveMaxHeight="MoveMaxHeight",
}

function HeightCalibration(){
    const navigate = useNavigate()
    const [offsetValue, setOffsetValue] = useState<number>(0);

    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [buttonEnable, setbuttonEnable] = useState(true)

    useEffect(() => {
        window.electronAPI.getOffsetSettingsTW().then((value:number[])=>{
          setOffsetValue(value[0])
        })
        const moveFinishListener = window.electronAPI.onMoveFinishMR(()=>{
            setbuttonEnable(true)
        })
        return ()=>{
            window.electronAPI.removeListener(moveFinishListener)
        }
      }, [])
      

    return (
        <div>
            <Header>
                Height Calibration
            </Header>
            <MainArea>
                <CalibrationArea>
                    <Calibration
                        title='Bed Height (µm)'
                        value={offsetValue}
                        sumValue1={10}
                        sumValue2={100}
                        onValueChange={(v : number,diff:number) => {
                            console.log(diff)
                            setbuttonEnable(false)
                            setOffsetValue(v)
                            window.electronAPI.moveMotorRM(MoveMotorCommand.MoveMicro,-diff)
                        }}
                        btnEnable={buttonEnable}/>
                </CalibrationArea>

            </MainArea>            
            <Footer>
                <Button color='gray' type='small' onClick={() => {navigate(-1)}}>Back</Button>
                <Button color='blue' type='small' enable={buttonEnable} onClick={() => {
                    window.electronAPI.saveHeightOffsetRM(offsetValue)
                    navigate(-1)
                    
                }}>Save Offset</Button>
            </Footer>
        </div>

            
    );
}
const CalibrationArea = styled.div`
    margin-top: -15px;
`
export default HeightCalibration;