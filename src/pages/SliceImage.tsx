import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import styled from 'styled-components'

function SliceImage() {
    console.log("Asdasdjasdkbsadbksad")
    return(
        <BackGround>
            <img src=''></img>
        </BackGround>
        );
}
export const Text = styled.div`
    color: #000000;
`
export const BackGround = styled.div`
    width: 100%;
    height: 100%;

    color: #000000; 
`
export default SliceImage;