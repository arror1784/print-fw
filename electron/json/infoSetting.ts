import { JsonSetting } from "./json";

interface InfoValue{
    layerHeight: number;
    totalLayer: number;
}

const _infoPath : string = "/opt/capsuleFw/"

class InfoSetting extends JsonSetting<InfoValue>{

    constructor(_infoPath:string,_infoData?:string){
        super(_infoPath,{fileData:_infoData,parser:InfoSetting.parser,saver:InfoSetting.saver})
    }

    static parser(ob : any) : InfoValue{
        return {layerHeight: ob.layer_height,totalLayer: ob.total_layer}
    }
    static saver(ob : InfoValue) : string{

        return JSON.stringify({
            layer_height: ob.layerHeight,
            total_layer: ob.totalLayer
        })
    }
}

export {InfoSetting}