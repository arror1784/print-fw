import { ChildProcess, spawn, } from "child_process"
class SubImageControl{

    private _programCommand = process.arch == 'arm' ? '/opt/capsuleFW/bin/hix-image-viewer': "./hix-image-viewer/build/hix-image-viewer" 
    private _childProcess : ChildProcess | undefined

    public isRun : boolean = false

    constructor(){
        process.on("exit",()=>{
            this.killProgram()
        })
    }

    runProgram(){
        if(process.arch != "arm")
            return

        var productionEnv = Object.create(process.env)
        productionEnv.DISPLAY = ':0'

        this._childProcess = spawn(this._programCommand,[],{detached:false,env:productionEnv})
        
        this._childProcess.stdout?.on('data',(data)=>{
            console.log((data as Buffer).toString())
        })
        this._childProcess.stderr?.on('data',(data)=>{
            console.log((data as Buffer).toString())
        })
        this.isRun = true
    }

    killProgram(){

        if(process.arch != "arm")
            return
        if(this._childProcess)
            this._childProcess.kill()
        this.isRun = false
    }
}

export { SubImageControl }