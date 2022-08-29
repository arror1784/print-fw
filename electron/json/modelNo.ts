import { JsonSetting } from "./json";
import { existsSync } from "fs";

interface ModelNoValue{
    modelNo: string;
}

const _versionPath : string = process.platform === "win32" ? process.cwd() + "/temp/modelNo.json" : "/opt/capsuleFW/modelNo.json"

class ModelNO extends JsonSetting<ModelNoValue>{

    constructor(){
        super(_versionPath,{fileData:existsSync(_versionPath) ? undefined : '{"modelNp":"A00000000"}'})
    }
    parse(ob: any): ModelNoValue {
        return ob
    }
    toJsonString(ob: ModelNoValue): string {
        return JSON.stringify(ob,null,2)
    }
}

const modelNOInstance = new ModelNO()

export function getModelNoInstaceSetting(){
    return modelNOInstance
}