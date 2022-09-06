import React from 'react';

import styled from 'styled-components'

interface HeaderProp{
    children: React.ReactNode
}

function Header({children} : HeaderProp){
    return (
        <HeaderText>
            {children}
        </HeaderText>
    );
}


const HeaderText = styled.div`
    color: #474747;
    font-size: 27px;
    font-weight: bold;

    letter-spacing: 1px;
    
    width: 479px;

    margin: auto;
    margin-top: 8px;
    margin-bottom: 10px;
`

export default Header;

