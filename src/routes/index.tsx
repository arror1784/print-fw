import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import SliceImage from '../pages/SliceImage';
import Button from '../components/Button';

import Home from '../pages/Home';
const AppRoute = () => {
    return (
        <Routes>
            <Route path='/' element={<Navigate to='/home'/>}/>
            <Route path='/home' element={<Home/>}/>
            <Route path='/model' element={<SliceImage/>}/>
            <Route path='/resin' element={<SliceImage/>}/>
            <Route path='/progress' element={<SliceImage/>}/>
            <Route path='/compelete' element={<SliceImage/>}/>

            <Route path='/setting' element={<SliceImage/>}/>

            <Route path='/calibration' element={<SliceImage/>}/>
            <Route path='/calibration/led' element={<SliceImage/>}/>
            <Route path='/calibration/height' element={<SliceImage/>}/>
            
            <Route path='/update/' element={<SliceImage/>}/>
            <Route path='/update/usb' element={<SliceImage/>}/>
            <Route path='/update/internet' element={<SliceImage/>}/>
            <Route path='/update/usb' element={<SliceImage/>}/>

            <Route path='/wifi' element={<SliceImage/>}/>


        </Routes>);
}

export default AppRoute;