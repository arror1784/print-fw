import { LEDEnable,MoveLength,MovePosition,Wait,actionType, Action, AutoHome, SetImage, CheckTime, LEDToggle, ProcessImage } from './actions'
import { ImageProvider } from './imageProvider';
import { UartConnection,UartConnectionTest } from './uartConnection'
import { getPrinterSetting } from './json/printerSetting'
import { ResinSetting, ResinSettingValue } from './json/resin';
import { InfoSetting, InfoSettingValue } from './json/infoSetting';
import { Stopwatch } from 'ts-stopwatch'
import { Worker } from 'worker_threads';
import { execSync } from 'child_process';

import * as fs from 'fs'
import AdmZip from 'adm-zip';
import sizeOf from 'image-size';
import { getProductSetting } from './json/productSetting';


const sliceFileRoot : string = process.platform === "win32" ? process.cwd() + "/temp/print/printFilePath/" : "/opt/capsuleFW/print/printFilePath/"

enum WorkingState{
    working = "working",
    stop = "stop",
    stopWork = "stopWork",
    pause = "pause",
    pauseWork = "pauseWork",
    error = "error"
}

enum MoveMotorCommand{
    GoHome="GoHome",
    AutoHome="AutoHome",
    MoveMicro="MoveMicro",
    MoveMaxHeight="MoveMaxHeight",
}
class PrintWorker{

    private _actions: Array<Action> = new Array<Action>(10000);

    private _name: string = ""
    private _currentStep: number = 0
    private _workingState: WorkingState = WorkingState.stop
    private _progress : number = 0
    private _lock : boolean = false
    private _lcdState : boolean = true
    private _printingErrorMessage : string = ""
    private _stopwatch : Stopwatch = new Stopwatch()
    private _curingStopwatch : Stopwatch = new Stopwatch()
    private _totalTime: number = 0

    private _onProgressCallback?: (progress : number) => void
    private _onWorkingStateChangedCallback?: (state : WorkingState,message?:string) => void
    private _onSetTotaltime?: (value : number) => void
    
    private _resinName : string= ""

    public get resinName() : string {
        return this._resinName
    }
    
    private _resinSetting : ResinSettingValue = {
        upMoveSetting: {
            accelSpeed: 0,
            decelSpeed: 0,
            maxSpeed: 0,
            initSpeed: 0,
        },
        downMoveSetting: {
            accelSpeed: 0,
            decelSpeed: 0,
            maxSpeed: 0,
            initSpeed: 0,
        },
    
        delay: 0,
        curingTime: 0,
        bedCuringTime: 0,
        ledOffset: 0,
        zHopHeight: 0,
        bedCuringLayer: 0,
        
        pixelContraction: 0,
        yMult:1
    };

    private _infoSetting : InfoSettingValue = {
        layerHeight: 0,
        totalLayer: 0,
    }
    get infoSetting() : InfoSettingValue {
        return this._infoSetting;
    }
    constructor(private readonly _uartConnection: UartConnection | UartConnectionTest,private readonly _imageProvider: ImageProvider){

        _uartConnection.checkConnection()
    }
    getPrintInfo(){ //[state,resinname,filename,layerheight,elapsedtime,totaltime,progress]
        return[this._workingState,this._resinName,this._name,this._infoSetting.layerHeight,this._stopwatch.getTime(),this._totalTime,this._progress,true]
    }
    
    setLcdState(v : boolean) {
        this._lcdState = v;
        if(!this._lcdState){
            this.stop()
        }
    }

    print(material:string,path:string,name:string){

        if(!fs.existsSync(path))
        throw new Error("Error: 파일이 존재하지 않습니다.")
        
        let zip = new AdmZip(path)
        if(!zip.test())
            throw new Error("zip archive error")
        
        fs.readdirSync(sliceFileRoot).forEach((value:string)=>{
            fs.rmSync(sliceFileRoot + value)
        })

        zip.extractAllTo(sliceFileRoot,true)

        if(fs.existsSync(sliceFileRoot+"/0.png")){
            let height = sizeOf(sliceFileRoot+"/0.png").height
            console.log(height)
            switch (getProductSetting().data.product) {
                case "C10":
                    if(height != 1440)
                        throw new Error("Error: 맞지 않는 이미지 사이즈 입니다.")
                    break;
                case "L10":
                    if(height != 1620)
                        throw new Error("Error: 맞지 않는 이미지 사이즈 입니다.")
                    break;
            }
        }
        let resin : ResinSetting
        if(fs.existsSync(sliceFileRoot+'/resin.json') && material == "custom"){
            resin = new ResinSetting("custom",fs.readFileSync(sliceFileRoot+'/resin.json',"utf8"))
        }else{
            resin = new ResinSetting(material)
        }

        if(process.platform === "win32" || process.arch != 'arm'){
            console.log("do hdmi reset")
        }else{
            execSync("vcgencmd display_power 0") // hdmi power off
            execSync("vcgencmd display_power 1") // hdmi power on
        }

        this.run(name,resin)
    }
    
    private run(name :string, resin:ResinSetting){
        this._name = name
        let info = new InfoSetting()

        if(!this._lcdState){
            
            throw new Error("Error: LCD가 빠졌습니다.")
        }
        this._currentStep = 0
        if(!info.isOpen())
            throw new Error("Error: info 파일이 존재하지 않습니다.")
        
        this._infoSetting = info.data
        this._resinName = resin.resinName

        if(resin.resinName == "custom"){
            this._resinSetting = resin.data["custom"]
        }else{
            if(!Object.keys(resin.data).includes(this._infoSetting.layerHeight.toString()))
                throw new Error("Error: 지원하지 않은 layer height입니다.")
            this._resinSetting = resin.data[info.data.layerHeight.toString()]
        }

        if(this._lock)
            throw new Error("Error: print lock이 걸려 있습니다.")

        this.createActions(this._resinSetting,this._infoSetting)

        this._uartConnection.init(this._resinSetting)

        this._workingState = WorkingState.working
        this._onWorkingStateChangedCallback && this._onWorkingStateChangedCallback(this._workingState)

        this._stopwatch.reset()

        this._curingStopwatch.reset()
        this._totalTime = 0

        this.process()

        return true
    }
    createActions(resinSetting : ResinSettingValue,infoSetting : InfoSettingValue) {

        let layerHeight = this._infoSetting.layerHeight * 1000
        this._actions = []

        this._actions.push(new ProcessImage(0,this._resinSetting.pixelContraction,this._resinSetting.yMult))
        this._actions.push(new AutoHome(255))

        this._actions.push(new SetImage())
        this._actions.push(new ProcessImage(1,this._resinSetting.pixelContraction,this._resinSetting.yMult))

        this._actions.push(new MoveLength(-(getPrinterSetting().data.height + getPrinterSetting().data.heightOffset - layerHeight)))

        for (let i = 1; i <= this._infoSetting.totalLayer; i++) {

            this._actions.push(new Wait(this._resinSetting.delay))

            if(i < this._resinSetting.bedCuringLayer)
                this._actions.push(new LEDToggle(this._resinSetting.bedCuringTime))
            else
                this._actions.push(new LEDToggle(this._resinSetting.curingTime))

            if(i==1)
                this._actions.push(new CheckTime("start"))

            this._actions.push(new SetImage())

            if((i + 1) < this._infoSetting.totalLayer)
                this._actions.push(new ProcessImage(i+1,this._resinSetting.pixelContraction,this._resinSetting.yMult))

            this._actions.push(new MoveLength(this._resinSetting.zHopHeight))

            this._actions.push(new MoveLength(-(this._resinSetting.zHopHeight - layerHeight)))
            if(i==1)
                this._actions.push(new CheckTime("finish"))
        }
    }
    pause(){
        this._workingState = WorkingState.pauseWork
        this._onWorkingStateChangedCallback && this._onWorkingStateChangedCallback(this._workingState)
    }
    resume(){
        this._workingState = WorkingState.working
        this._onWorkingStateChangedCallback && this._onWorkingStateChangedCallback(this._workingState)
        this.process()
    }
    async stop(){
        const prevState = this._workingState
        this._workingState = WorkingState.stopWork
        this._lock = true
        this._stopwatch.stop()

        if(prevState != WorkingState.working && prevState != WorkingState.pauseWork){
            this.process()
        }

        this._onWorkingStateChangedCallback && this._onWorkingStateChangedCallback(this._workingState)
    }
    printAgain(resin?:ResinSetting){
        this.run(this._name,resin || new ResinSetting(this._resinName))
    }
    async process(){
        this._stopwatch.start()
        while(this._currentStep <= this._actions.length) {

            if(this._currentStep == this._actions.length)
                this.stop()
            
            if(!this._lcdState){
                this._workingState = WorkingState.error
                this._printingErrorMessage = "Error: LCD가 빠졌습니다."
            }
            switch (this._workingState) {
                case WorkingState.pauseWork:
                    this._workingState = WorkingState.pause
                    this._stopwatch.stop()
                    this._onWorkingStateChangedCallback && this._onWorkingStateChangedCallback(this._workingState)
                    return;
                case WorkingState.stopWork:
                    await this._uartConnection.sendCommandMovePosition(-15000)
                    this._workingState = WorkingState.stop
                    this._onWorkingStateChangedCallback && this._onWorkingStateChangedCallback(this._workingState)
                    this._imageProvider.reloadImageProgram()

                    return;
                case WorkingState.error:
                    this._onWorkingStateChangedCallback && this._onWorkingStateChangedCallback(WorkingState.error,this._printingErrorMessage)
                    this.stop()
                    return;
                default:
                    break;
            }
            this._progress = this._currentStep / this._actions.length
            this._onProgressCallback && this._onProgressCallback(this._progress)

            const action = this._actions[this._currentStep]
            console.log("PROCESS WHILE",this._currentStep,action.type)
            switch (action.type) {
                case "autoHome":
                    await this._uartConnection.sendCommandAutoHome(255)

                    break;
                case "ledEnable":
                    checktime()
                    this._uartConnection.sendCommandLEDEnable((action as LEDEnable).enable)
                    checktime()
                    break;
                case "ledToggle":
                    // checktime()
                    while(!this._imageProvider.isDoneImageSet){
                        if(this._imageProvider.isDoneImageSet) break
                        else await new Promise(resolve => setTimeout(resolve,100));
                    }
                    this._uartConnection.sendCommandLEDEnable(true)
                    // console.log((action as LEDToggle).timeout)
                    await new Promise(resolve => setTimeout(resolve, (action as LEDToggle).timeout));
                    this._uartConnection.sendCommandLEDEnable(false)
                    // checktime()
                    break;
                case "moveLength":
                    await this._uartConnection.sendCommandMoveLength((action as MoveLength).length)

                    break;
                case "movePosition":
                    await this._uartConnection.sendCommandMovePosition((action as MovePosition).position)

                    break;
                case "wait":
                     await new Promise(resolve => setTimeout(resolve, (action as Wait).msec));

                    break;
                case "processImage":
                    this._imageProvider.processImage((action as ProcessImage).index,(action as ProcessImage).delta,(action as ProcessImage).ymult)

                    break;
                case "setImage":
                    while(!this._imageProvider.isDoneImageProcessing){
                        if(this._imageProvider.isDoneImageProcessing) break
                        else await new Promise(resolve => setTimeout(resolve,100));
                    }
                    this._imageProvider.setImage()

                    break;
                case "checkTime":
                    switch ((action as CheckTime).checkTimeType) {
                        case 'start':
                            this._curingStopwatch.start()
                            break;
                        case 'finish':
                            this._curingStopwatch.stop()
                            this._totalTime = this._stopwatch.getTime()
                            this._totalTime = this._totalTime + this._curingStopwatch.getTime() * (this._infoSetting.totalLayer - 1)
                            this._totalTime = this._totalTime + this._resinSetting.bedCuringTime * (this._resinSetting.bedCuringLayer - 1)
                            this._totalTime = this._totalTime + this._resinSetting.curingTime * (this._infoSetting.totalLayer - this._resinSetting.bedCuringLayer)
                            this._totalTime = this._totalTime + this._resinSetting.delay * (this._infoSetting.totalLayer - 1)

                            this._onSetTotaltime && this._onSetTotaltime(this._totalTime)
                            break;
                        default:
                            break;
                    }
                    break;
                default:
                    break;
            }
            this._currentStep++
        }
    }
    unlock(){
        this._lock = false
    }
    onProgressCB(cb : (progreess: number) => void){
        this._onProgressCallback = cb
    }
    onStateChangeCB(cb : (state : WorkingState,message?:string) => void){
        this._onWorkingStateChangedCallback = cb
    }
    onSetTotalTimeCB(cb : (value : number) => void){
        this._onSetTotaltime = cb
        
    }

    async moveMotor(command : MoveMotorCommand,value:number){
        console.log(command)
        switch (command) {
            case MoveMotorCommand.AutoHome:
                await this._uartConnection.sendCommandAutoHome(255)
                break;
            case MoveMotorCommand.GoHome:
                await this._uartConnection.sendCommandMovePosition(-15000)
                break;
            case MoveMotorCommand.MoveMaxHeight:
                await this._uartConnection.sendCommandMoveLength(-(getPrinterSetting().data.height + getPrinterSetting().data.heightOffset))
                break;
            case MoveMotorCommand.MoveMicro:
                await this._uartConnection.sendCommandMoveLength(value)
                break;
            default:
                break;
        }

    }
}

function checktime(){
    let a = new Date(Date.now())
    console.log(a.getSeconds(),a.getMilliseconds())
}


export {PrintWorker,WorkingState,MoveMotorCommand}
