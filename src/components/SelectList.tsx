import React from 'react';

import ListContainer from './ListContainer';
import styled from 'styled-components'

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
    extentions: string;
}

function SelectList( {children,width,height,selectListModel,onContainerSelect,highlightId} : SelectListProps){
    // console.log(selectListModel)
    return (
        <MainListArea width={width} height={height}>
            <FileListArea width={width} height={height}>
                <FileListBox width={width} height={height}>
                    {
                    selectListModel.map((list:SelectListModel) => {
                        return <ListContainer isHighlight={highlightId == list.id}
                            onClick={() =>{onContainerSelect && onContainerSelect(list)}} containerText= {list.name}/>
                    })
                    }
                </FileListBox>
            </FileListArea>
        </MainListArea>
    );
    // return (<div> <img src={wifiImg} sizes="(min-width: 600px) 200px, 50vw"/> </div>);
}

SelectList.defaultProps = {
    width: 450,
    height: 210,
    highlightIndex: -1,
    extentions: "",
}

export const MainListArea = styled.div< { width: number,height:number }>`
    display: flex;

    width: ${(props) => (props.width)}px;
    height: ${(props) => (props.height)}px;

    flex-direction: column;
    align-items: center;
`
export const FileListArea = styled.div< { width: number,height:number }>`
    display: flex;
    width: ${(props) => (props.width)}px;
    height: ${(props) => (props.height)}px;

    flex-grow: 1;
`
export const FileListBox = styled.div< { width: number,height:number }>`
    width: ${(props) => (props.width)}px;
    height: ${(props) => (props.height)}px;

    flex-basis: 100%;
    background-color: #FFFFFF;
    
    border-radius: 8px;

    overflow: scroll;
    overflow-x: hidden;
`

export { SelectList };
export type { SelectListModel };
