import React from 'react'
import ImageButton from '../components/ImageButton';
import fileImg from '../assets/file.png';
import settingImg from '../assets/settings.png';
import infoImg from '../assets/info.png';
import styled from 'styled-components'

function Home(){
    return (
    <HomeArea>
        <ImageButton type="main1" src={fileImg}>Select File</ImageButton>
        <RightButtons>
            <ImageButton type="main2" src={settingImg} color="gray">Setting</ImageButton>
            <ImageButton type="main2" src={infoImg} color="gray">Info</ImageButton> 
        </RightButtons>

    </HomeArea>);
    // return (<div> <img src={wifiImg} sizes="(min-width: 600px) 200px, 50vw"/> </div>);
}
export const HomeArea = styled.div`
    display: flex;
    // float: right;
`
export const RightButtons = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 15px;
    // float: right;
`
export default Home;

