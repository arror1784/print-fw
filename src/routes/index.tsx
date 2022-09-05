import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import SliceImage from '../pages/SliceImage';
import Button from '../components/Button';

import Home from '../pages/Home';
import Model from '../pages/Model';
import Setting from '../pages/Setting';
import Progress from '../pages/Progress';
import Complete from '../pages/Complete';
import Material from '../pages/Material';
import HeightCalibration from '../pages/HeightCalibration';
import UpdateFileSelect from '../pages/UpdateFileSelect';
import Update from '../pages/Update';
import LEDCalibration from '../pages/LEDCalibration';
import Wifi from '../pages/Wifi';
import UpdateSetting from '../pages/UpdateSetting';
import UpdateModeSetting from '../pages/UpdateModeSetting';
import FactoryReset from '../pages/FactoryReset';
import { UartConnection } from '../../electron/uartConnection';
import UartConnectionError from '../pages/UartConnectionError';

const AppRoute = () => {
    return (
        <Routes>
            <Route path='/' element={
                typeof window.imageAPI != "undefined" ? <Navigate to='/image'/> : <Navigate to='/home'/>
            }/>
            <Route path='/home' element={<Home/>}/>
            <Route path='/model' element={<Model/>}/>
            <Route path='/material'>
                <Route path=':selectPath' element={<Material/>}></Route>
            </Route>
            <Route path='/progress' element={<Progress/>}/>
            <Route path='/complete/:totalElapsedTime/:error' element={<Complete/>}/>

            <Route path='/setting' element={<Setting/>}/>

            <Route path='/calibration'>
                <Route path='led' element={<LEDCalibration/>}/>
                <Route path='height' element={<HeightCalibration/>}/>
            </Route>
            
            <Route path='/updateSetting'>
                <Route path=''  element={<UpdateSetting/>}/>
                <Route path=':updateTarget'>
                    <Route path='' element={<UpdateModeSetting/>}/>
                    <Route path='usb' element={<UpdateFileSelect/>}/>
                </Route>
            </Route>
            <Route path='/update/:updateTarget/:updateMode/:updatePath' element={<Update/>}/>
            <Route path='/update/:updateTarget/:updateMode' element={<Update/>}/>
            <Route path='/wifi' element={<Wifi/>}/>
            
            <Route path='/image' element={<SliceImage/>}/>
            <Route path='/factoryReset' element={<FactoryReset/>}/>
            <Route path='/uartConnectionError' element={<UartConnectionError/>}/>
        </Routes>
        );
}

export default AppRoute;