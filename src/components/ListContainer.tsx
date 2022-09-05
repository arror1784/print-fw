import React from 'react';
import styled from 'styled-components'
import SlideText from './SlideText';

interface ListContainerProps{
    containerText: string;
    onClick: (() => void) | undefined;
    isHighlight: boolean;
}

function ListContainer({containerText, onClick,isHighlight}:ListContainerProps){
    return(
        <ListContainerStyled onClick={onClick} isHighlight={isHighlight}>
            {
                isHighlight ? 
                <SlideText text={containerText}/> : containerText
            }
        </ListContainerStyled>
    );
}

ListContainer.defaultProps = {
    isHighlight:false,
    containerText: ""
}

const ListContainerStyled = styled.div<{isHighlight:boolean}>`
    font-size: 20px;
    color:  ${(props) => (props.isHighlight ? '#FFFFFF' : '#474747')};
    background-color: ${(props) => (props.isHighlight ? '#B6CDDC' : '#FFFFFF')};
    text-align: left;
    /* margin: 4px; */
    margin-left: 4px;
    padding-left: 5px;
    border-radius: 8px;
    white-space:nowrap;
`
export default ListContainer;