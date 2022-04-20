import React from 'react';
import styled from 'styled-components'

interface ListContainerProps{
    text: string;
}

function ListContainer({text}:ListContainerProps){
    return(
        <ListContainerStyled>
            {text}
        </ListContainerStyled>
    );
}

export const ListContainerStyled = styled.div`
    font-size: 20px;
    color: #474747;
    text-align: left;
    margin: 4px;
    margin-left: 10px;
`
export default ListContainer;