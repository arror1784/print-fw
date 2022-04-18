import React from 'react'
import Button from '../components/Button';
import ImageButton from '../components/ImageButton';
import fileImg from '../assets/file.png';
import settingImg from '../assets/settings.png';
import infoImg from '../assets/info.png';
import classNames from 'classnames';

import './Home.scss';
function Home(){
    return (
    <div className="home">
        <ImageButton type="main1" src={fileImg}>Select File</ImageButton>
        <div className='left-buttons'>
            <ImageButton type="main2" src={settingImg} color="gray">Setting</ImageButton>
            <ImageButton type="main2" src={infoImg} color="gray">Info</ImageButton> 
        </div>

    </div>);
    // return (<div> <img src={wifiImg} sizes="(min-width: 600px) 200px, 50vw"/> </div>);
}

export default Home;

