import React, { useEffect, useState } from 'react';
import styled from 'styled-components'

import Button from '../components/Button';

import Footer from '../layout/Footer';
import Header from '../layout/Header';

import Calibration from '../components/Calibration';
import MainArea from '../layout/MainArea';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import { IpcRendererEvent } from 'electron';


enum MoveMotorCommand{
    GoHome="GoHome",
    AutoHome="AutoHome",
    MoveMicro="MoveMicro",
    MoveMaxHeight="MoveMaxHeight",
}

function HeightCalibration(){
    const navigate = useNavigate()
    const [offsetValue, setOffsetValue] = useState<number>(0);

    const [buttonEnable, setbuttonEnable] = useState(true)

    const [waitforVisible, setwaitforVisible] = useState(false)

    let moveMotor = (command:MoveMotorCommand,value:number)=>{
        window.electronAPI.moveMotorRM(command,value)
    }

    useEffect(() => {
        window.electronAPI.getOffsetSettingsTW().then((value:number[])=>{
          setOffsetValue(value[0])
        })
        const moveFinishListener = window.electronAPI.onMoveFinishMR((event:IpcRendererEvent,command:MoveMotorCommand,value:number)=>{
            switch(command){
                case MoveMotorCommand.AutoHome:
                    moveMotor(MoveMotorCommand.MoveMaxHeight,0)
                    break;
                case MoveMotorCommand.GoHome:
                    navigate(-1)
                    break;
                case MoveMotorCommand.MoveMaxHeight:
                    setwaitforVisible(false)
                    setbuttonEnable(true)
                    break;
                case MoveMotorCommand.MoveMicro:
                    setbuttonEnable(true)
                    break;
                default:
                    break;
            }
        })
        moveMotor(MoveMotorCommand.AutoHome,0)
        setwaitforVisible(true)

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
                            moveMotor(MoveMotorCommand.MoveMicro,-diff)
                        }}
                        btnEnable={buttonEnable}/>
                </CalibrationArea>

            </MainArea>            
            <Footer>
                <Button color='gray' type='small' enable={!waitforVisible} onClick={() => {
                    moveMotor(MoveMotorCommand.GoHome,0)
                    setwaitforVisible(true)

                }}>Back</Button>
                <Button color='blue' type='small' enable={!waitforVisible && buttonEnable} onClick={() => {
                    window.electronAPI.saveHeightOffsetRM(offsetValue)
                    moveMotor(MoveMotorCommand.GoHome,0)
                    setwaitforVisible(true)
                }}>Save Offset</Button>
            </Footer>
            <Modal visible={waitforVisible} btnEnable={false} backVisible={false} selectVisible={false}>
                wait for movement
            </Modal>
        </div>

            
    );
}
const CalibrationArea = styled.div`
    margin-top: -15px;
`
export default HeightCalibration;