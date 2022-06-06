import React from 'react';

import styled from 'styled-components'

import plusBtnImg from '../assets/plus.png';
import minusBtnImg from '../assets/minus.png';

type CalibrationProps = {
  title: string;
  value: number;
  maxValue?: number;
  minValue?: number;

  sumValue1: number;
  sumValue2: number;

  onValueChange?: (v : number) => void;
}

function Calibration({title,value,minValue,maxValue,sumValue1,sumValue2,onValueChange} : CalibrationProps){


  return (
      <CalibrationContainer>
        <CalibrationTitle>{title}</CalibrationTitle>
        <CalibrationValue>{value}</CalibrationValue>
        <SumButton onClick={()=>{
          if(!maxValue)
            return
          onValueChange && onValueChange(value + sumValue1 >= maxValue ? maxValue : value + sumValue1)
        }}> <SumButtonImg src={plusBtnImg}/> </SumButton>
        <SumButton onClick={()=>{
          if(!maxValue)
            return
            onValueChange && onValueChange(value + sumValue2 >= maxValue ? maxValue : value + sumValue2)
        }}> <SumButtonImg src={plusBtnImg}/> </SumButton>

        <SumButton onClick={()=>{
          if(!minValue)
            return
          onValueChange && onValueChange(value - sumValue1 <= minValue ? minValue : value - sumValue1)
        }}> <SumButtonImg src={minusBtnImg}/> </SumButton>
        <SumButton onClick={()=>{
          if(!minValue)
            return
          onValueChange && onValueChange(value - sumValue2 <= minValue ? minValue : value - sumValue2)
        }}> <SumButtonImg src={minusBtnImg}/> </SumButton>

        <SumValue>{sumValue1}</SumValue>
        <SumValue>{sumValue2}</SumValue>

      </CalibrationContainer>
    );
}

Calibration.defaultProps = {
  title: "",
  value: 0.0,
  maxValue: 0.0,
  minValue: 0.0,
  sumValue1: 0.0,
  sumValue2: 0.0,
  };


export const CalibrationContainer = styled.div`
  display: grid;
  color: black;
  grid-template-areas:
		"title title . plusBtn1    plusBtn2"
		"value value . sumValue1   sumValue2"
		"value value . minusBtn1   minusBtn2";
  justify-items: center;
  align-items: center;

  row-gap: 10px;  
  column-gap: 15px;
  grid-template-columns: 1fr 1fr 1.1fr 1fr 1fr;
`
export const CalibrationTitle = styled.div`
  grid-area: title;

  color: #666666;

  font-size: 20px;
`
export const CalibrationValue = styled.div`
  grid-area: value;
  font-size: 30px;
`

export const SumButton = styled.div`
  display: flex;
  
  justify-content: center;
  align-items: center;

  background-color: #C9DBE6;
  border-style: none;
  border-radius: 8px;

  width: 45px;
  height: 45px;

  &:nth-child(3){
    grid-area: plusBtn1;
  }
  &:nth-child(4){
    grid-area: plusBtn2;
  }
  &:nth-child(5){
    grid-area: minusBtn1;
  }
  &:nth-child(6){
    grid-area: minusBtn2;
  }

`
export const SumButtonImg = styled.img`
  width: 30px;
`
export const SumValue = styled.div`
  color: #9CB5C4;
  font-size: 20px;

  &:nth-child(7){
    grid-area: sumValue1;
  }
  &:nth-child(8){
    grid-area: sumValue2;
  }
`


export default Calibration;