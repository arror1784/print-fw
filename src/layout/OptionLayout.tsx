import React from 'react';
import styled from 'styled-components'

interface OptionLayoutProp{
    children: React.ReactNode
}

function OptionLayout({children} : OptionLayoutProp){
    return (
        <OptionContainer>
            {children}
        </OptionContainer>
    );
}
const OptionContainer = styled.div`
    display: grid;

    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;

    row-gap: 10px;
    column-gap: 20px;

    margin: 10px;
`
export default OptionLayout;