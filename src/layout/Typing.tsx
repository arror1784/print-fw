import React, { useEffect, useRef, useState } from 'react';

import styled from 'styled-components'

import Keyboard from 'react-simple-keyboard'

import 'react-simple-keyboard/build/css/index.css'
import './Typing.scss'

interface TypingProp{
    onTypingFinish: () => void;
}

const layout = {
    'default': [
        '` 1 2 3 4 5 6 7 8 9 0 - = {bksp}',
        'q w e r t y u i o p [ ] \\',
        'a s d f g h j k l ; \' {enter}',
        'z x c v b n m , . / {shift}',
        '{space}'
    ],
    'shift': [
        '~ ! @ # $ % ^ &amp; * ( ) _ + {bksp}',
        'Q W E R T Y U I O P { } |',
        'A S D F G H J K L : " {enter}',
        'Z X C V B N M &lt; &gt; ? {shift}',
        '{space}'
    ]
}

type targetType = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

function Typing({onTypingFinish} : TypingProp){
    
    const [value,setValue] = useState<string>("")
    const [layoutName, setlayoutName] = useState<string>("default")
    const [visible,setVisible] = useState<boolean>(false)
    const [target,setTarget] = useState<targetType | undefined>(undefined)

    const ref = useRef();
    useEffect(() => {
        function inputEventHandler(e:globalThis.FocusEvent){
          if(e.target?.tagName == "INPUT"){
          
            let asd = (e.target as targetType)
            // asd.value = "hello world"  
            setValue(asd.value ? asd.value.toString() : "")
            setVisible(true)
            setTarget(asd)
          }
        }
        window.addEventListener("focusin",inputEventHandler);
        return window.removeEventListener("focusin", inputEventHandler, true);
      }, []);
      useEffect(() => {
        function keyboardEventHandler(e:globalThis.KeyboardEvent){
            console.log(e.key)
        }
        window.addEventListener("keypress",keyboardEventHandler)
        return window.removeEventListener("keypress", keyboardEventHandler, true);
      }, []);
    return (
        <KeyboardBackground>
            {
            visible ? <KeyboardFlex>
                <ValueText>{value}</ValueText>
                <Keyboard 
                    layout={layout}
                    layoutName={layoutName}
                    mergeDisplay={true}
                    display={
                        {
                        '{bksp}':'\u232b',
                        '{enter}': 'enter',
                        }
                    }
                    onKeyPress={(button:string)=>{
                        console.log(button)
                        if(button == "{shift}"){
                            setlayoutName(layoutName == "default" ? "shift" : "default")
                        }else if(button == "{enter}"){
                            setVisible(false)
                            if(target){
                                target.defaultValue = value
                            }
                            onTypingFinish()
                        }else if(button == "{bksp}"){
                            setValue(value.slice(0, -1))
                        }else if(button == "{space}"){
                            setValue(value+' ')   
                        }else if(button == "&lt;"){
                            setValue(value+'<')   
                        }else if(button == "&gt;"){
                            setValue(value+'>')   
                        }else{
                            setValue(value+button)
                        }
                    }}
                />
            </KeyboardFlex> : <div></div>
            }
        </KeyboardBackground>
        
    );
}
const KeyboardBackground = styled.div`

    position: absolute;
    top: '50%';
    left: '50%';
    transform: 'translate(-50%, -50%)';

    outline: 'none';
    padding: "0px";
    z-index: 1;
`
const KeyboardFlex = styled.div`
    display: flex;

    width: 479px;
    height: 320px;

    flex-direction: column;
    align-items: center;
    justify-content: center;

    background-color: #EEF5F9;

`
const ValueText = styled.div`
    width: 400px;
    height: 40px;

    font-size: 22px;
    border-color: #00000000;
    border-radius: 8px;
    background-color: white;


`
export default Typing;

