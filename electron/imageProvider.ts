type Product = "C10" | "L10"

const binding = require('bindings')
const addOn = binding("rgbTrans")


class ImageProvider{

    private _cb? : (src:string) => void

    imageCB(v : (src:string) => void) {
        this._cb = v;
    }
    

    constructor(private readonly _product : Product,private readonly rootPath : string){

    }

    async setImage(index : number, delta:number, ymult:number) : Promise<boolean>{
        
        this._cb && this._cb(addOn.transRgbToBase64(this.rootPath+`/${index}.png`,delta,ymult,this._product == "L10"))
        return true;
    }
}

export {ImageProvider}