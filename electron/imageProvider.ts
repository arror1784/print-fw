type Product = "C10" | "L10"

const binding = require('bindings')
const addOn = binding("rgbTrans")

class ImageProvider{

    private readonly rootPath = "/opt/capsuleFW/print/printFilePath"

    constructor(private readonly product : Product){

    }

    async setImage(index : number,delta:number,ymult:number){

        return addOn.transRgbToBase64("/home/jsh/0.png",delta,ymult,this.product == "L10")
    }
    
}

export {ImageProvider}