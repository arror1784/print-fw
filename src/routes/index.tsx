import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import SliceImage from '../pages/SliceImage';
import Button from '../components/Button';

import Home from '../pages/Home';
import Model from '../pages/Model';
import Setting from '../pages/Setting';
import Progress from '../pages/Progress';
const AppRoute = () => {
    return (
        <Routes>
            <Route path='/' element={<Navigate to='/progress'/>}/>
            <Route path='/home' element={<Home/>}/>
            <Route path='/model' element={<Model/>}/>
            <Route path='/resin' element={<SliceImage/>}/>
            <Route path='/progress' element={<Progress/>}/>
            <Route path='/compelete' element={<SliceImage/>}/>

            <Route path='/setting' element={<Setting/>}/>

            <Route path='/calibration' element={<SliceImage/>}/>
            <Route path='/calibration/led' element={<SliceImage/>}/>
            <Route path='/calibration/height' element={<SliceImage/>}/>
            
            <Route path='/update/' element={<SliceImage/>}/>
            <Route path='/update/usb' element={<SliceImage/>}/>
            <Route path='/update/internet' element={<SliceImage/>}/>
            <Route path='/update/usb' element={<SliceImage/>}/>

            <Route path='/wifi' element={<SliceImage/>}/>
        </Routes>
        );
}

export default AppRoute;