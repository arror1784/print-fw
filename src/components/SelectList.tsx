import React from 'react';
import classNames from 'classnames';
import Button from '../components/Button';

import arrowDir from'../assets/arrow-dir.png'
import './SelectList.scss';
import ImageButton from '../components/ImageButton';
import Footer from '../layout/Footer';



interface SelectListProps {
    children?: React.ReactNode;
}

function SelectList( {children} : SelectListProps){
    return (
        <div className='main-area'>
            <div className='main-text'>
                Select a file to print
            </div>
            <div className='parent-area'>
                <button className='parent-dir-button'>
                    <img width='20px' src={arrowDir}></img>
                </button>
                <div className='current-dir-name'>hello world</div>
            </div>
            <div className='file-list-area'>
                <div className='file-list-box'>
                    {children}
                </div>
            </div>
        </div>
    );
    // return (<div> <img src={wifiImg} sizes="(min-width: 600px) 200px, 50vw"/> </div>);
}

export default SelectList;