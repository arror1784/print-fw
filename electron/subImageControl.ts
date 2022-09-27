import { ChildProcess, spawn, } from "child_process"

class SubImageControl{

    private _programCommand = process.arch == 'arm' ? 'DISPLAY=:0 /opt/hix-image-viewer/hix-image-viewer': "./hix-image-viewer/build/hix-image-viewer" 
    private _childProcess : ChildProcess | undefined

    public isRun : boolean = false

    constructor(){
        process.on("exit",()=>{
            this.killProgram()
        })
    }

    runProgram(){
        this._childProcess = spawn(this._programCommand,[],{detached:false})
        
        this._childProcess.stdout?.on('data',(data)=>{
            console.log((data as Buffer).toString())
        })
        this._childProcess.stderr?.on('data',(data)=>{
            console.log((data as Buffer).toString())
        })
        this.isRun = true
    }

    killProgram(){
        if(this._childProcess)
            this._childProcess.kill()
        this.isRun = false
    }
}

export { SubImageControl }