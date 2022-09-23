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
        return {layerHeight: Number((ob.layer_height * 100).toFixed()) / 100,totalLayer: ob.total_layer}
    }
    toJsonString(ob : InfoSettingValue) : string{

        return JSON.stringify({
            layer_height: ob.layerHeight,
            total_layer: ob.totalLayer
        },null,2)
    }
}

export {InfoSetting}
export type {InfoSettingValue}