import React, { useState } from 'react';

import styled from 'styled-components'

import Keyboard from 'react-simple-keyboard'

import 'react-simple-keyboard/build/css/index.css'
import './Typing.scss'

interface TypingProp{
    onTypingFinish: () => void
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

function Typing({onTypingFinish} : TypingProp){
    
    const [value, setvalue] = useState<string>("")
    const [layoutName, setlayoutName] = useState<string>("default")
    return (
        <div>
            <input value={value}> 
            </input>
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
                onChange={setvalue}
                onKeyPress={(button:string)=>{
                    console.log(button)
                    if(button == "{shift}"){
                        setlayoutName(layoutName == "default" ? "shift" : "default")
                    }else if(button == "{enter}"){
                        onTypingFinish()
                    }
                }}
            />
        </div>
    );
}

export default Typing;

