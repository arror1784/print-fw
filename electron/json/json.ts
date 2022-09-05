import { existsSync, readFileSync, writeFileSync } from "fs";

interface ConstructProps<T>{
    fileData? : string;
}
abstract class JsonSetting<T>{

    public data: T
    private _fileData? : string
    private _isOpen : boolean

    constructor(protected _filePath : string,{fileData} : ConstructProps<T>){
        
        this._fileData = fileData

        if(fileData){
            try {
                this.data = JSON.parse(fileData) as T
            } catch (error) {
                throw new Error("Error: JSON 파일 형식에 맞지 않은 파일입니다. " + _filePath);
                
            }
            this._isOpen = true
        }else{
            if(!existsSync(_filePath))
                this._isOpen = false
            else
                this._isOpen = true

            const productFile : string = readFileSync(_filePath, 'utf-8');
            this.data = JSON.parse(productFile) as T
        }

        this.data = this.parse(this.data as any)
    }
    abstract parse(ob : any) : T
    abstract toJsonString(ob : T) : string
    saveFile(){
        writeFileSync(this._filePath,this.toJsonString(this.data))
    }
    isOpen(){
        return this._isOpen
    }
}

export { JsonSetting }