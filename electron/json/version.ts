import { JsonSetting } from "./json";
import { existsSync } from "fs";

interface VersionValue{
    version: string;
}

const _versionPath : string = "/opt/capsuleFw/version.json"

class VersionSetting extends JsonSetting<VersionValue>{

    constructor(){
        super(_versionPath,{fileData:existsSync(_versionPath) ? undefined : '{"version":"0.0.0"}'})
    }
}

const versionInstance = new VersionSetting()

export function getVersionSetting(){
    return versionInstance
}