import { JsonSetting } from "./json";

interface InfoSettingValue{
    layerHeight: number;
    totalLayer: number;
}

const _infoPath : string = "/opt/capsuleFw/print/printFilePath"

class InfoSetting extends JsonSetting<InfoSettingValue>{

    constructor(_infoData?:string){
        super(_infoPath,{fileData:_infoData,parser:InfoSetting.parser,saver:InfoSetting.saver})
    }

    static parser(ob : any) : InfoSettingValue{
        return {layerHeight: ob.layer_height,totalLayer: ob.total_layer}
    }
    static saver(ob : InfoSettingValue) : string{

        return JSON.stringify({
            layer_height: ob.layerHeight,
            total_layer: ob.totalLayer
        })
    }
}

export {InfoSetting}
export type {InfoSettingValue}