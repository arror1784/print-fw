import * as binding from 'bindings'

export interface RgbTrans {
    SayHi : () => string
}

const addOn : RgbTrans = binding("RGBTRANS")

export { addOn }
