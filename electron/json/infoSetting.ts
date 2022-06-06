import { JsonSetting } from "./json";

interface InfoSettingValue{
    layerHeight: number;
    totalLayer: number;
}

const _infoPath : string = process.platform === "win32" ? process.cwd() + "/temp/print/printFilePath/info.json" : "/opt/capsuleFW/print/printFilePath/info.json"

class InfoSetting extends JsonSetting<InfoSettingValue>{

    constructor(_infoData?:string){
        super(_infoPath,{fileData:_infoData})
    }

    parse(ob : any) : InfoSettingValue{
        return {layerHeight: ob.layer_height,totalLayer: ob.total_layer}
    }
    save(ob : InfoSettingValue) : string{

        return JSON.stringify({
            layer_height: ob.layerHeight,
            total_layer: ob.totalLayer
        })
    }
}

export {InfoSetting}
export type {InfoSettingValue}