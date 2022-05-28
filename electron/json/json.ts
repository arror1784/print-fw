import { existsSync, readFileSync, writeFileSync } from "fs";

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
    private _isOpen : boolean

    constructor(private _filePath : string,{parser,saver,fileData} : ConstructProps<T>){
        this._parser = parser
        this._saver = saver
        this._fileData = fileData

        if(fileData){
            this.data = JSON.parse(fileData) as T
            this._isOpen = true
        }else{
            if(!existsSync(_filePath))
                this._isOpen = false
            else
                this._isOpen = true

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
    isOpen(){
        return this._isOpen
    }
}

export { JsonSetting }