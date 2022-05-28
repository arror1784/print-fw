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
    onStartError = "worker:onStartError",
    onProgress = "worker:onProgress"
}
enum ImageCH{
    changeImage = 'image::changeImage',
    changeScale = "image::changeScale"
}
export { FileSystemCH,WorkerCH,ProductCH,ResinCH,ImageCH}