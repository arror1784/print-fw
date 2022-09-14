import bindings from "bindings";
import {parentPort} from 'worker_threads';

enum WorkerMethod{
    SetImage = "setImage",
    ProcessImage = "ProcessImage"
}

const addOn = bindings("rgbTrans")

if(parentPort){
    parentPort.on("message",(value)=>{
        if(value as String == WorkerMethod.SetImage){
            console.log("Worker: setImage")
            addOn.setImage()
        }else{
            let arr = (value as String).split(",")
            console.log(arr)
            addOn.transRgbToBase64(arr[0],Number(arr[1]),Number(arr[2]),arr[3].toLowerCase() == "l10")
        }
        parentPort?.postMessage("finish")
    })
}

export {WorkerMethod}
