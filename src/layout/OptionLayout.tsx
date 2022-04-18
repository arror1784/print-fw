import React from 'react';
import classNames from 'classnames';

import './OptionLayout.scss';

interface OptionLayoutProp{
    children: React.ReactNode
}

function OptionLayout({children} : OptionLayoutProp){
    return (
        <div className='option-contatiner'>
            {children}
        </div>
    );
}

export default OptionLayout;