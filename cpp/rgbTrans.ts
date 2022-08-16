import binding from 'bindings'

export interface RgbTrans {
    transRgbToBase64 : (path:string,delta:number,ymult:number,isL10:boolean) => string
}

const addOn : RgbTrans = binding("rgbTrans")

export { addOn }
