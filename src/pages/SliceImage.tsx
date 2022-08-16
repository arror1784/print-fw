import { IpcRendererEvent } from 'electron';
import React, { useState } from 'react';
import styled from 'styled-components'

function SliceImage() {

    const [scale,setScale] = useState<number>(1)
    const [source,setSource] = useState<string>("")

    window.imageAPI.onChangeScaleMR((_event:IpcRendererEvent, scale:number) => {
        setScale(Number((scale * 100).toPrecision()))
    })
    window.imageAPI.onChangeImageMR((_event:IpcRendererEvent, img:string) => {
        setSource(img)
    })
    return(
        <BackGround>
            <IMG src={source} scale={scale}></IMG>
        </BackGround>
        );
}
const BackGround = styled.div`
    width: 100%;
    height: 100%;

    color: #000000; 
`
const IMG = styled.img<{scale:number}>`
    width: ${(props) => (props.scale ? `${props.scale}%` : '100%')};
    height: ${(props) => (props.scale ? `${props.scale}%` : '100%')};
`
export default SliceImage;