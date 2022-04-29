import React from 'react';
import styled from 'styled-components'

interface ListContainerProps{
    containerText: string;
    onClick: (() => void) | undefined;
    isHighlight: boolean;
}

function ListContainer({containerText, onClick,isHighlight}:ListContainerProps){
    return(
        <ListContainerStyled onClick={onClick} isHighlight={isHighlight}>
            {containerText}
        </ListContainerStyled>
    );
}

ListContainer.defaultProps = {
    isHighlight:false,
    containerText: ""
}

export const ListContainerStyled = styled.div<{isHighlight:boolean}>`
    font-size: 20px;
    color:  ${(props) => (props.isHighlight ? '#FFFFFF' : '#474747')};
    background-color: ${(props) => (props.isHighlight ? '#B6CDDC' : '#FFFFFF')};
    text-align: left;
    margin: 4px;
    margin-left: 10px;
    padding-left: 5px;
    border-radius: 8px;
`
export default ListContainer;