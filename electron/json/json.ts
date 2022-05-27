import { readFileSync, writeFileSync } from "fs";

interface ConstructProps<T>{
    parser? : (ob:any) => T;
    saver? : (ob:T) => string;
    fileData? : string;
}
class JsonSetting<T>{

    public data: T
    private _parser? : (ob:any) => T
    private _saver? : (ob:T) => string
    private _fileData? : string

    constructor(private _filePath : string,{parser,saver,fileData} : ConstructProps<T>){
        this._parser = parser
        this._saver = saver
        this._fileData = fileData

        if(fileData){
            this.data = JSON.parse(fileData) as T
        }else{
            const productFile : string = readFileSync(_filePath, 'utf-8');
            this.data = JSON.parse(productFile) as T
        }


        if(this._parser)
            this.data = this._parser(this.data)
    }

    save(){
        if(this._saver)
            writeFileSync(this._filePath,this._saver(this.data))
        else
            writeFileSync(this._filePath,JSON.stringify(this.data))
    }
}

export { JsonSetting }