import { readFileSync } from "fs";

class JsonSetting<T>{

    private _object: T
    private _parser?: (ob : any) => void

    constructor(private _filePath:string){
        const productFile : string = readFileSync(_filePath, 'utf-8');
        this._object = JSON.parse(productFile)
    }

    getSetting(){
        return this._object
    }
    setSetting(setting: T){
        this._object = setting
    }
}

export { JsonSetting }