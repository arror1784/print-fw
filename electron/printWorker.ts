import {LEDEnable,MoveLength,MovePosition,Wait,actionType, Action} from './actions'
import { ProductSetting } from './ProductSetting';
import { PrintSettings } from './Settings';
import {UartConnection,UartConnectionTest} from './uartConnection'

enum WorkingState{
    working,
    stop,
    pause
}

class PrintWorker{

    actions: Array<Action> = [];

    private _currentStep: number = 0;
    private _isRun: boolean = false;
    private _isMoving: boolean = false;
    private _workingState: WorkingState = WorkingState.stop;
    private _progress : number = 0;
    private _onProgressCallback?: () => void
    private _printSetting : PrintSettings = {
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
        layerHeigth: 0,
        totalLayer: 0,
        zHopHeight: 0,
        bedCuringLayer: 0,
        
        pixelContraction: 0,
        
    };

    get printSetting() : PrintSettings {
        return this.printSetting;
    }
    constructor(public readonly uartConnection: UartConnection | UartConnectionTest){
        uartConnection.checkConnection()
    }

    init(){
        this.uartConnection.init(this.printSetting)
        this._progress = 0.0
    }
    run(setting : PrintSettings) {
        this._workingState = WorkingState.working;

        this._printSetting = setting;

        this.init()

        this.actions.push(new MovePosition(-(ProductSetting.getInstance().height + ProductSetting.getInstance().heightOffset - this._printSetting.layerHeigth)))

        for (let i = 0; i < this._printSetting.totalLayer; i++) {

            this.actions.push(new LEDEnable(true))


            if(i < this._printSetting.bedCuringLayer)
                this.actions.push(new Wait(this._printSetting.bedCuringTime))
            else
                this.actions.push(new Wait(this._printSetting.curingTime))

            this.actions.push(new LEDEnable(false))
            this.actions.push(new MovePosition(this._printSetting.zHopHeight))

            this.actions.push(new MoveLength(-(this._printSetting.zHopHeight - this._printSetting.layerHeigth)))

        }
        this.actions.push(new MovePosition(-15000))

        this.process()

    }
    pause(){

    }
    stop(){

    }

    async process(){
        while(this._currentStep < this.actions.length && this._isRun) {
            
            if(!this._isMoving)
                continue

            this._progress = this._currentStep / this.actions.length
            this._onProgressCallback && this._onProgressCallback()

            const action = this.actions[this._currentStep]
            switch (action.type) {
                case "ledEnable":
                    (action as LEDEnable).enable;

                    break;

                case "MoveLength":
                    
                    this._isMoving = true
                    this.uartConnection.sendCommandMoveLength((action as MoveLength).length, () => { this._isMoving = false })
                    break;

                case "movePosition":

                    this._isMoving = true
                    await this.uartConnection.sendCommandMoveLength((action as MovePosition).position, () => { this._isMoving = false })

                    break;

                case "wait":
                    await new Promise(resolve => setTimeout(resolve, (action as Wait).msec));
                    break;
            
                default:
                    break;
            }
            this._currentStep++
        }
    }
    onProgressCB(cb :() => {}){
        this._onProgressCallback = cb
    }
}