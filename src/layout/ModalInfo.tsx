import React from 'react'
import styled from 'styled-components';

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
        <ValueText> {text} </ValueText>
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
`
const ValueText = styled.div`
    font-size: 23px;
    color: #000000;
    justify-self: left;
    /* max-width: ; */
`

export {ModalInfoMainArea,ModalInfoTitle,ModalInfoValue};

