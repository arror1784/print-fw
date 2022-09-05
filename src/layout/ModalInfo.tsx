import React from 'react'
import styled from 'styled-components';
import SlideText from '../components/SlideText';

interface ModalInfoMainAreaProp{
    children: React.ReactNode;

}

function ModalInfoMainArea({children} : ModalInfoMainAreaProp){
    return (
        <InfoArea >
            {children}
        </InfoArea>
    );
}

interface ModalInfoTitleProp{
    text:string
}

function ModalInfoTitle({text} : ModalInfoTitleProp){
    return (
        <TitleText> {text} </TitleText>
    );
}

interface ModalInfoValueProp{
    text:string
}

function ModalInfoValue({text} : ModalInfoValueProp){
    return (
        <ValueText>
            <SlideText text={text}/>
        </ValueText>
    );
}
interface ModalNoticeProp{
    text:string
}

function ModalNotice({text} : ModalInfoTitleProp){
    return (
        <NoticeText> {text} </NoticeText>
    );
}

const InfoArea = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-items: right;
    row-gap: 8px;
    column-gap: 26px;
    width: 100%;
`
const TitleText = styled.div`
    font-size: 23px;
    color: #474747;
    background-color: #00000000;

    justify-self: right;
    /* min-width: 150px; */
    max-width: 150px;
`
const ValueText = styled.div`
    font-size: 23px;
    color: #000000;
    justify-self: left;
    max-width: 180px;
`
const NoticeText = styled.div`
    font-size: 18px;
`
export {ModalInfoMainArea,ModalInfoTitle,ModalInfoValue,ModalNotice};

