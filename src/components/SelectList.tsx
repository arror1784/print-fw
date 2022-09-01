import React from 'react';

import ListContainer from './ListContainer';
import styled from 'styled-components'
import ImageButton from './ImageButton';

import upButton from '../assets/arrow-up.png'
import downButton from '../assets/arrow-down.png'

import { Element, animateScroll as scroll} from 'react-scroll'

import './SelectList.scss'

interface SelectListModel{
    name: string;
    id: number;
}

interface SelectListProps {
    children?: React.ReactNode;
    width: number;
    height: number; 
    selectListModel: SelectListModel[];
    highlightId : number | undefined;
    onContainerSelect: ((model : SelectListModel) => void) | undefined
}

function SelectList( {children,width,height,selectListModel,onContainerSelect,highlightId} : SelectListProps){

    return (
        <MainListArea width={width} height={height}>
            <FileListArea width={width} height={height}>
                <Element name="test7" className="Element" id="containerElement" style={{
                    width: "100%",
                    height: `${height}px`,
                    overflow: "scroll"
                }}>
                    {
                    selectListModel.map((list:SelectListModel) => {
                        return <ListContainer key={list.id} isHighlight={highlightId == list.id}
                            onClick={() =>{onContainerSelect && onContainerSelect(list)}} containerText= {list.name}/>
                    })
                    }
                </Element>
                {
                selectListModel.length > 5 &&
                    <ButtonList>
                        <ImageButton color='gray' type='side' src={upButton} onClick={()=>{scroll.scrollMore(-130,{containerId:"containerElement",duration:200})}}></ImageButton>
                        <ImageButton color='gray' type='side' src={downButton} onClick={()=>{scroll.scrollMore(130,{containerId:"containerElement",duration:200})}}></ImageButton>
                    </ButtonList>
                }
            </FileListArea>
        </MainListArea>
    );
}

SelectList.defaultProps = {
    width: 450,
    height: 210,
    highlightIndex: -1,
}

const MainListArea = styled.div< { width: number,height:number }>`
    display: flex;

    width: ${(props) => (props.width)}px;
    height: ${(props) => (props.height)}px;

    flex-direction: column;
    align-items: center;
`
const FileListArea = styled.div< { width: number,height:number }>`
    display: flex;
    width: ${(props) => (props.width)}px;
    height: ${(props) => (props.height)}px;

    flex-basis: 100%;
    background-color: #FFFFFF;
    
    border-radius: 8px;


    flex-grow: 1;
`
const FileListBox = styled.div< { width: number,height:number }>`
    width: ${(props) => (props.width)}px;
    height: ${(props) => (props.height)}px;

    overflow: scroll;
    ::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
    
    overflow-x: hidden;
`
const ButtonList = styled.div`
    display: flex;

    flex-direction: column;
    height: 100%;
    align-items: center;
    justify-content: space-evenly;

    margin-right: 10px;
    margin-left: 10px;
`
export { SelectList };
export type { SelectListModel };
