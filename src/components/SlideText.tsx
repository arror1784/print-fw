

import classNames from 'classnames'
import styled from 'styled-components'

import { Element, animateScroll as scroll,} from 'react-scroll'
import React, { useEffect, useRef, useState } from 'react'

import { v4 as uuidV4 } from 'uuid'
type SlideTextProps = {
    text:string,
}
const sleep = async (ms?: number) => new Promise(resolve => setTimeout(resolve, ms));

function SlideText({text}:SlideTextProps){
    const [slideID, setslideID] = useState("")
    const [timerID, settimerID] = useState<NodeJS.Timer>()

    const ref = useRef<HTMLDivElement|null>(null)
    const countref = useRef<number>(0)
    
    const slideSpeed = 23

    const doAnimaion =  async ()=>{
        if(!ref.current)
            return
        const bouncingWidth = ref.current.getBoundingClientRect().width
        const scrollWidth = ref.current.scrollWidth

        const duration = (scrollWidth - bouncingWidth) * slideSpeed

        if(countref.current <= 0){
            if(ref.current.scrollLeft != 0){
                scroll.scrollTo(0,{containerId:slideID,duration:0,horizontal:true})
                countref.current = 5
            }else{
                scroll.scrollMore(+216,{containerId:slideID,duration:duration,horizontal:true,smooth:false})
                countref.current = (duration / 500) + 5
            }
        }else{
            countref.current = countref.current - 1
        }
        return duration
    }

    useEffect(()=>{

        let uuid = "slideID-"+uuidV4()

        setslideID(uuid)

        return ()=>{
            if(timerID)
                clearInterval(timerID)
        }

    },[])

    useEffect(() => {
        
        const id = setInterval(doAnimaion,500)
        
        return ()=>{
            clearInterval(id)
        }
    }, [slideID])
    
    return <Slide ref={ref} className={classNames('slide-left')} id={slideID}>
        {text}
    </Slide>
}
const Slide = styled.div`
    width: 100%;
    overflow-y: hidden;
    overflow-x: hidden;
`
export default SlideText