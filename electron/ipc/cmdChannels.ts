import { type } from "os";

//(target:command),(parameter:type),(parameter:type),...,(RT:return type) 
//if return type is void, it can be empty

// 웹 과의 호환성을 위하여 twoway 채널은 사용을 지양

//*RM - Renderer to Main
//*MR - Main to Renderer
//*TW - Renderer to Main Two Way

enum FileSystemCH{
    readDirTW = "FileSystem:readDir,RT:DirOrFile[]",
    getLayerHeightTW = "FileSystem:getLayerHeight,filePath:string",
    isCustomTW = "Filesystem:getLayerHeightTW,filePath:string"
}

enum ResinCH{
    resinListTW = "resin:resinList,RT:string[]"
}

enum ProductCH{
    getOffsetSettingsTW = "product:getOffsetSettings,RT:string[]",
    getProductInfoTW = "product:getProductInfo,RT:string[]",
    
    onLCDStateChangedMR = "product:onLCDStateChanged,state:boolean",
    onShutDownEventMR = "product:onShutDownEvent",

    onShutDownRM = "product:onShutDown",
}

enum WorkerCH{
    startRM = "worker:start,path:string,material:string",
    commandRM = "worker:command,cmd:string",
    unlockRM = "worker:unlock",
    
    requestPrintInfoRM = "worker:requestPrintInfo",
    onWorkingStateChangedMR = "worker:onWorkingStateChanged,state:string",
    onPrintInfoMR = "worker:onPrintInfo,state:string,material:string,filename:string,layerheight:number,elapsedTime:number,totalTime:number,progress:number,enabelTimer:number",
    onStartErrorMR = "worker:onStartError,error:string",
    onProgressMR = "worker:onProgress,progress:number",

    
}
enum ImageCH{
    changeImageMR = 'image:changeImage,image:string',
    changeScaleMR = "image:changeScale,scale:number"
}
export { FileSystemCH,WorkerCH,ProductCH,ResinCH,ImageCH }