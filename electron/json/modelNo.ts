import { JsonSetting } from "./json";
import { existsSync } from "fs";

interface ModelNOValue{
    version: string;
}

const _versionPath : string = "/opt/capsuleFw/version.json"

class ModelNO extends JsonSetting<ModelNOValue>{

    constructor(){
        super(_versionPath,{fileData:existsSync(_versionPath) ? undefined : '{"version":"0.0.0"}'})
    }
}

const modelNOInstance = new ModelNO()

export function getModelNoInstaceSetting(){
    return modelNOInstance
}