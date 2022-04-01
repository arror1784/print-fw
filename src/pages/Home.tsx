import React from 'react'
import Button from '../components/Button';
import ImageButton from '../components/ImageButton';
import wifiImg from '../assets/wifi.png'

function Home(){
    return (<div> <ImageButton src={wifiImg}>qwr</ImageButton> </div>);
    // return (<div> <img src={wifiImg} sizes="(min-width: 600px) 200px, 50vw"/> </div>);
}

export default Home;

