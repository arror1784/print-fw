import { type } from "os";

enum FileSystemCH{
    readDir = "FileSystem:readDir",
}

enum ResinCH{
    resinList = "resin:resinList"
}

enum ProductCH{
    getOffsetSettings = "product:getOffsetSettings",
    getPrinterInfo = "product:getPrinterInfo",
    
    onLCDStateChanged = "product:onLCDStateChanged"
}

enum WorkerCH{
    start = "worker:start",
    command = "worker:command",

    onWorkingStateChanged = "worker:onWorkingStateChanged",
    onPrintInfo = "worker:onPrintInfo",
}
enum ImageCH{
    changeImage = 'image::changeImage'
}
export { FileSystemCH,WorkerCH,ProductCH,ResinCH,ImageCH}