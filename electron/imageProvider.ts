import { app } from "electron";
import { existsSync } from "fs";
import { Worker } from "worker_threads";
import { SubImageControl } from "./subImageControl";
import { WorkerMethod } from "./worker/worker";

type Product = "C10" | "L10"
class ImageProvider{

    private _cb? : (src:string) => void

    private _imageWorker: Worker

    public isDoneImageProcessing:boolean = true
    public isDoneImageSet:boolean = true
    private _sic = new SubImageControl()
    imageCB(v : (src:string) => void) {
        this._cb = v;
        this._sic.runProgram()
    }

    constructor(private readonly _product : Product,private readonly rootPath : string){
        this._imageWorker = new Worker( app.isPackaged ? __dirname + '/worker/worker.js' : './electron/worker/build/worker.js')

        this._imageWorker.on("message",(value: WorkerMethod)=>{
            console.log("main thread receive",value)
            if(value == WorkerMethod.SetImage){
                this.isDoneImageSet = true
            }else{
                this.isDoneImageProcessing = true
            }
        })
    }
    async setImage(){
        this.isDoneImageSet = false
        this._imageWorker.postMessage(WorkerMethod.SetImage)
        return true
    }
    async processImage(index : number, delta:number, ymult:number){
        if(index < 0)
            return false
        this.isDoneImageProcessing = false
        this._imageWorker.postMessage(this.rootPath +`${index}.png,`+ delta.toString()+","+ ymult.toString()+","+this._product)
        return true
    }
    async reloadImageProgram(){
        this._sic.killProgram()
        this._sic.runProgram()
    }
}

export {ImageProvider}