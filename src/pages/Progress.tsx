import React, { useState } from 'react';
import classNames from 'classnames';

import styled from 'styled-components'

import './Progress.scss';
import Button from '../components/Button';
import Footer from '../layout/Footer';

import Modal from '../components/Modal';

import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';

function Progress(){

    const [progressValue, setProgressValue] = useState(45)

    return (
        <div>
            <div className='circular-progress-bar'>

                <TitleText>
                    asd
                </TitleText>
                <ValueText> 
                    asd
                </ValueText>
                <TitleText>
                    asd
                </TitleText>
                <ValueText>
                    asd
                </ValueText>

                <CircleProgress>
                    <CircularProgressbarWithChildren value={progressValue} maxValue={100} minValue={0} strokeWidth={7} 
                        styles={buildStyles({
                            strokeLinecap: "round",
                            pathColor: `#00C6EA`,
                        })}>
                        <ProgressBarText>
                            Progress
                        </ProgressBarText>
                        <ProgressValue>
                            {`${progressValue}%`}
                        </ProgressValue>
                    </CircularProgressbarWithChildren>
                </CircleProgress>
            </div>
            <Footer>
                <Button color='gray' type='small' onClick={() => {console.log("back btn clicked")}}> Back </Button>
                <Button color='none' type='small' onClick={() => {console.log("back btn clicked")}}> </Button> 
            </Footer>
        </div>
    );
}

const ProgressBarText = styled.div`
    color: #474747;
    font-size: 20px;
`
const ProgressValue = styled.div`
    color: #474747;
    font-size: 40px;
    font-weight: bold;
`
const TitleText = styled.div`
    color: #474747;
    font-size: 15px;
        
`
const ValueText = styled.div`
    color: #474747;
    font-size: 27px;
    font-weight: bold;
`
const CircleProgress = styled.div`
    grid-column-start: 2;
    grid-column-end: 3;

    grid-row-start: 1;
	grid-row-end: 5;

    align-self: center;

    width: 180px;
    height: 180px;
`


export default Progress;