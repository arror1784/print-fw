import React from 'react';

import './SelectList.scss';

import styled from 'styled-components'

interface SelectListProps {
    children?: React.ReactNode;
    width: number;
    height: number; 
}

function SelectList( {children,width,height} : SelectListProps){
    return (
        <MainListArea width={width} height={height}>
            <FileListArea width={width} height={height}>
                <FileListBox width={width} height={height}>
                    {children}
                </FileListBox>
            </FileListArea>
        </MainListArea>
    );
    // return (<div> <img src={wifiImg} sizes="(min-width: 600px) 200px, 50vw"/> </div>);
}

SelectList.defaultProps = {
    width: 450,
    height: 210,
}

export const MainListArea = styled.div< { width: number,height:number }>`
    display: flex;

    width: ${(props) => (props.width)}px;
    height: ${(props) => (props.height)}px;

    flex-direction: column;
    align-items: center;
`
export const FileListArea = styled.div< { width: number,height:number }>`
    display: flex;
    width: ${(props) => (props.width)}px;
    height: ${(props) => (props.height)}px;

    flex-grow: 1;
`
export const FileListBox = styled.div< { width: number,height:number }>`
    width: ${(props) => (props.width)}px;
    height: ${(props) => (props.height)}px;

    flex-basis: 100%;
    background-color: #FFFFFF;
    
    border-radius: 8px;

    overflow: scroll;
    overflow-x: hidden;
`

export default SelectList;