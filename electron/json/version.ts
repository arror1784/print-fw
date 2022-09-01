import { JsonSetting } from "./json";
import { existsSync } from "fs";
import { json } from "node:stream/consumers";

interface VersionValue{
    version: string;
}

const _versionPath : string = process.platform === "win32" ? process.cwd() + "/temp/version.json" : "/opt/capsuleFW/version.json"

class VersionSetting extends JsonSetting<VersionValue>{

    constructor(){
        super(_versionPath,{fileData:existsSync(_versionPath) ? undefined : '{"version":"0.0.0"}'})
    }
    parse(ob: any): VersionValue {
        return ob
    }
    toJsonString(ob: VersionValue): string {
        return JSON.stringify(ob,null,2)
    }
}

const versionInstance = new VersionSetting()

export function getVersionSetting(){
    return versionInstance
}