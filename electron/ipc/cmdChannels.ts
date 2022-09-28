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
    isCustomTW = "Filesystem:getLayerHeightTW,filePath:string",
    getUSBPathTW = "FileSystemCH    :getUSBPathTW",

}

enum ResinCH{
    resinListTW = "resin:resinList,RT:string[]",

}
enum UpdateCH{

    getSWCurrentVersionTW = "update:getSWCurrentVersionTW",
    getSWServerVersionTW = "update:getSWServerVersionTW",
    getSWFileVersionTW = "update:getSWFileVersionTW",
    
    softwareUpdateRM = "update:softwareUpdate",
    softwareFileUpdateRM = "update:softwareFileUpdate",
    
    getResinCurrentVersion = "update:getResinCurrentVersion,RT:string",
    getResinServerVersion = "update:getResinServerVersion",
    getResinFileVersion = "update:getResinFileVersion",

    resinUpdateRM = "update:resinUpdateRM",
    resinFileUpdateRM = "pdate:resinFileUpdateRM",


    factoryRestRM = "update:factoryResetRM",

    onUpdateNoticeMR = "update:onResinUpdateNoticeMR"

}
enum ProductCH{
    getOffsetSettingsTW = "product:getOffsetSettings,RT:string[]",
    getProductInfoTW = "product:getProductInfo,RT:string[]",
    getUartConnectionErrorTW = "product:getUartConnectionErrorTW",

    onLCDStateChangedMR = "product:onLCDStateChanged,state:boolean",
    onShutDownEventMR = "product:onShutDownEvent",
    onMoveFinishMR = "product:onMoveFinishMR",

    shutDownRM = "product:onShutDown",
    saveLEDOffsetRM = "product:saveLEDOffsetRM,int",
    saveHeightOffsetRM = "product:saveHeightOffsetRM",
    moveMotorRM = "product:moveBedHeightRM,command:string,value:number",
}

enum WorkerCH{
    startRM = "worker:start,path:string,material:string",
    commandRM = "worker:command,cmd:string",
    unlockRM = "worker:unlock",
    
    requestPrintInfoRM = "worker:requestPrintInfo,RT:[state,resinname,filename,layerheight,elapsedtime,totaltime,progress]",
    onWorkingStateChangedMR = "worker:onWorkingStateChanged,state:string,message:string",
    onPrintInfoMR = "worker:onPrintInfo,state:string,material:string,filename:string,layerheight:number,elapsedTime:number,totalTime:number,progress:number,enabelTimer:number",
    onStartErrorMR = "worker:onStartError,error:string",
    onProgressMR = "worker:onProgress,progress:number",
    onSetTotalTimeMR = "worker:onSetTotalTimeMR",
}
enum ImageCH{
    changeImageMR = 'image:changeImage,image:string',
    changeScaleMR = "image:changeScale,scale:number"
}
enum WifiCH{
    connectWifiRM = 'wifi:connectWifi,ssid:string,bssid:string,passwd:string|null',
    disconnectWifiRM = 'wifi:disconnectWifiRM',
    scanWifiRM = 'wifi:scanWifiRM',

    getWifiListTW = 'wifi:getWifiListTW',
    getCurrentWifiStatusTW = 'wifi:getCurrentWifiStatusTW',

    onStatusChangeMR = 'wifi:onStatusChangeMR',
    onWifiListChangeMR = 'wifi:onWifiListChangeMR',
    onWifiNoticeMR = 'wifi:onWifiNoticeMR',

}
export { FileSystemCH,WorkerCH,ProductCH,ResinCH,ImageCH,WifiCH,UpdateCH }