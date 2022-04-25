import {PrintSettings,LEDEnable,MoveLength,MovePosition,Wait,actionType, Action} from './IOActions'
import {UartConnection,UartConnectionTest} from './uartConnection'

class PrintWorker{

    actions: Array<Action> = [];
    private currentStep: number = 0;
    private isRun: boolean = false;
    
    constructor(public readonly printSetting: PrintSettings, public readonly uartConnection: UartConnectionTest){
        uartConnection.checkConnection()
        this.init()

        this.actions.push(new MovePosition(123))

    }

    init(){
        this.uartConnection.sendCommand(`H32 A${this.printSetting.upMoveSetting.accelSpeed} M1`)
        this.uartConnection.sendCommand(`H32 A${this.printSetting.downMoveSetting.accelSpeed} M2`)
        this.uartConnection.sendCommand(`H33 A${this.printSetting.upMoveSetting.decelSpeed} M1`)
        this.uartConnection.sendCommand(`H33 A${this.printSetting.downMoveSetting.decelSpeed} M2`)
        this.uartConnection.sendCommand(`H30 A${this.printSetting.upMoveSetting.maxSpeed} M1`)
        this.uartConnection.sendCommand(`H30 A${this.printSetting.downMoveSetting.maxSpeed} M2`)
        this.uartConnection.sendCommand(`H31 A${this.printSetting.upMoveSetting.initSpeed} M1`)
        this.uartConnection.sendCommand(`H31 A${this.printSetting.downMoveSetting.initSpeed} M2`)

        this.uartConnection.sendCommand(`H12 A${this.printSetting.ledOffset}`)


    }

    async run() {
        for (; this.currentStep < this.actions.length && this.isRun; this.currentStep++) {
            const action = this.actions[this.currentStep]
            switch (action.type) {
                case "MoveLength":
                    (action as MoveLength).length;
                    break;
                case "ledEnable":
                    (action as LEDEnable).enable;

                    break;
                case "movePosition":
                    (action as MovePosition).position;

                    break;
                case "wait":
                    await new Promise(resolve => setTimeout(resolve, (action as Wait).msec));
                    break;
            
                default:
                    break;
            }
        }
    }
    pause(){

    }
    stop(){

    }

    process(){

    }
}