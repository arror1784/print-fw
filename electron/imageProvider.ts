import { app } from "electron";
import { existsSync } from "fs";
import { Worker } from "worker_threads";
import { WorkerMethod } from "./worker/worker";

type Product = "C10" | "L10"
class ImageProvider{

    private _cb? : (src:string) => void

    private _imageProcessingWorker: Worker
    private _imageSetWorker: Worker

    public isDoneImageProcessing:boolean = true
    public isDoneImageSet:boolean = true

    imageCB(v : (src:string) => void) {
        this._cb = v;
    }

    constructor(private readonly _product : Product,private readonly rootPath : string){
        this._imageProcessingWorker = new Worker( app.isPackaged ? __dirname + '/worker/worker.js' : './electron/worker/build/worker.js')
        this._imageSetWorker = new Worker( app.isPackaged ? __dirname + '/worker/worker.js' : './electron/worker/build/worker.js')

        this._imageProcessingWorker.on("message",(value)=>{
            console.log("image processing finish")
            this.isDoneImageProcessing = true
        })
        this._imageSetWorker.on("message",(value)=>{
            console.log("image set finish")
            this.isDoneImageSet = true
        })
    }
    async setImage(){
        this.isDoneImageSet = false
        this._imageSetWorker.postMessage(WorkerMethod.SetImage)
        return true
    }
    async processImage(index : number, delta:number, ymult:number){
        if(index < 0)
            return false
        this.isDoneImageProcessing = false
        this._imageProcessingWorker.postMessage(this.rootPath +`${index}.png,`+ delta.toString()+","+ ymult.toString()+","+this._product)
        return true
    }
}

export {ImageProvider}