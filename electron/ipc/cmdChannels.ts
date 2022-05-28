import { type } from "os";

//(target:command),(parameter:type),(parameter:type),...,(RT:return type) 
//if return type is void, it can be empty

enum FileSystemCH{
    readDirTW = "FileSystem:readDir,RT:DirOrFile[]",
}

enum ResinCH{
    resinListTW = "resin:resinList,RT:string[]"
}

enum ProductCH{
    getOffsetSettingsTW = "product:getOffsetSettings,RT:string[]",
    getPrinterInfoTW = "product:getPrinterInfo,RT:string[]",
    
    onLCDStateChanged = "product:onLCDStateChanged,state:boolean"
}

enum WorkerCH{
    startRM = "worker:start,name:string,material:string,height:number",
    commandRM = "worker:command,cmd:string",

    onWorkingStateChangedMR = "worker:onWorkingStateChanged,state:string",
    onPrintInfoMR = "worker:onPrintInfo,state:string,material:string,filename:string,layerheight:number,elapsedTime:number,totalTime:number,progress:number,enabelTimer:number",
    onStartErrorMR = "worker:onStartError,error:string",
    onProgressMR = "worker:onProgress,progress:string"
}
enum ImageCH{
    changeImageMR = 'image:changeImage,image:string',
    changeScaleMR = "image:changeScale,scale:number"
}
export { FileSystemCH,WorkerCH,ProductCH,ResinCH,ImageCH}