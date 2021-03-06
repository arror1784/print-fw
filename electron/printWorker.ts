import { LEDEnable,MoveLength,MovePosition,Wait,actionType, Action, AutoHome, SetImage } from './actions'
import { ImageProvider } from './imageProvider';
import { UartConnection,UartConnectionTest } from './uartConnection'
import { getPrinterSetting } from './json/printerSetting'
import { ResinSetting, ResinSettingValue } from './json/resin';
import { InfoSetting, InfoSettingValue } from './json/infoSetting';

enum WorkingState{
    working = "working",
    stop = "stop",
    stopWork = "stopWork",
    pause = "pause",
    pauseWork = "pauseWork",
    error = "error"
}

class PrintWorker{

    private _actions: Array<Action> = new Array<Action>(10000);

    private _name: string = ""
    private _currentStep: number = 0
    private _workingState: WorkingState = WorkingState.stop
    private _progress : number = 0
    private _lock : boolean = false

    private _onProgressCallback?: (progress : number) => void
    private _onWorkingStateChangedCallback?: (state : WorkingState) => void

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
    getPrintInfo(){
        return[this._workingState,this._resinName,this._name,this._infoSetting.layerHeight,0,0,this._progress,true]
    }
    run(name :string, resin:ResinSetting){
        this._name = name
        let info = new InfoSetting()

        this._currentStep = 0
        if(!info.isOpen())
            return new Error("uart connect error")
        
        this._infoSetting = info.data
        this._resinName = resin.resinName

        if(resin.resinName == "custom"){
            this._resinSetting = resin.data["custom"]
        }else{
            if(!Object.keys(resin.data).includes(this._infoSetting.layerHeight.toString()))
                return new Error("resin height not available")
            if(this._lock)
                return new Error("print Lock")
        
            this._resinSetting = resin.data[info.data.layerHeight.toString()]
        }

        this.createActions(this._resinSetting,this._infoSetting)

        this._uartConnection.init(this._resinSetting)

        this._workingState = WorkingState.working
        this._onWorkingStateChangedCallback && this._onWorkingStateChangedCallback(this._workingState)

        this.process()

        return true
    }
    createActions(resinSetting : ResinSettingValue,infoSetting : InfoSettingValue) {

        let layerHeight = this._infoSetting.layerHeight * 1000
        this._actions = []

        this._actions.push(new SetImage(0,this._resinSetting.pixelContraction,this._resinSetting.yMult))

        this._actions.push(new AutoHome(255))

        this._actions.push(new MoveLength(-(getPrinterSetting().data.height + getPrinterSetting().data.heightOffset - layerHeight)))

        for (let i = 0; i < this._infoSetting.totalLayer; i++) {
            this._actions.push(new Wait(this._resinSetting.delay))

            this._actions.push(new LEDEnable(true))

            if(i < this._resinSetting.bedCuringLayer)
                this._actions.push(new Wait(this._resinSetting.bedCuringTime))
            else
                this._actions.push(new Wait(this._resinSetting.curingTime))

            this._actions.push(new LEDEnable(false))

            this._actions.push(new SetImage(i+1,this._resinSetting.pixelContraction,this._resinSetting.yMult))

            this._actions.push(new MoveLength(this._resinSetting.zHopHeight))

            this._actions.push(new MoveLength(-(this._resinSetting.zHopHeight - layerHeight)))
        }
        this._actions.push(new SetImage(-1,this._resinSetting.pixelContraction,this._resinSetting.yMult))
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

        if(prevState != WorkingState.working && prevState != WorkingState.pauseWork){
            this.process()
        }

        this._onWorkingStateChangedCallback && this._onWorkingStateChangedCallback(this._workingState)
    }
    printAgain(resin?:ResinSetting){
        this.run(this._name,resin || new ResinSetting(this._resinName))
    }
    async process(){
        while(this._currentStep <= this._actions.length) {
            console.log("PROCESS WHILE",this._currentStep)
            
            if(this._currentStep == this._actions.length)
                this.stop()

            switch (this._workingState) {
                case WorkingState.pauseWork:
                    this._workingState = WorkingState.pause
                    this._onWorkingStateChangedCallback && this._onWorkingStateChangedCallback(this._workingState)
                    return;
                case WorkingState.stopWork:
                    await this._uartConnection.sendCommandMovePosition(-15000)
                    this._workingState = WorkingState.stop
                    this._onWorkingStateChangedCallback && this._onWorkingStateChangedCallback(this._workingState)
                    return;
                default:
                    break;
            }
            this._progress = this._currentStep / this._actions.length
            this._onProgressCallback && this._onProgressCallback(this._progress)

            const action = this._actions[this._currentStep]
            switch (action.type) {
                case "autoHome":
                    await this._uartConnection.sendCommandAutoHome(255)

                    break;
                case "ledEnable":
                    this._uartConnection.sendCommandLEDEnable((action as LEDEnable).enable)

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
                case "setImage":
                    this._imageProvider.setImage((action as SetImage).index,(action as SetImage).delta,(action as SetImage).ymult)
                    
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
    onStateChangeCB(cb : (state : WorkingState) => void){
        this._onWorkingStateChangedCallback = cb
    }
}

export {PrintWorker,WorkingState}
