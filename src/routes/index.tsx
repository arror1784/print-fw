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
            <Route path='/complete' element={<Complete/>}/>

            <Route path='/setting' element={<Setting/>}/>

            <Route path='/calibration'>
                <Route path='led' element={<LEDCalibration/>}/>
                <Route path='height' element={<HeightCalibration/>}/>
            </Route>
            
            <Route path='/update/' element={<Update/>}/>
            <Route path='/update/file' element={<SliceImage/>}/>
            <Route path='/update/usb' element={<UpdateFileSelect/>}/>
            <Route path='/update/internet' element={<SliceImage/>}/>

            <Route path='/wifi' element={<SliceImage/>}/>
            
            <Route path='/image' element={<SliceImage/>}/>

        </Routes>
        );
}

export default AppRoute;