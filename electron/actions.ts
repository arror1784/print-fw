import {UartConnection} from './uartConnection';

type actionType = "movePosition" | "moveLength" | "ledEnable" | "ledToggle" | "wait" | "setImage" | "autoHome" | "checkTime" | "processImage";
const enum moveType{
    DOWN = 0,
    UP = 1
}
abstract class Action{
    abstract readonly type: actionType;
}

class AutoHome extends Action{
    type: actionType = "autoHome";

    constructor(public readonly speed:number){
        super()
    }
}
class MovePosition extends Action{
    type: actionType = "movePosition";

    constructor(public readonly position:number){
        super()
    }
}

class MoveLength extends Action{
    type: actionType = "moveLength";

    constructor(public readonly length:number){
        super()
    }
}

class LEDEnable extends Action{
    type: actionType = "ledEnable";

    constructor(public readonly enable: boolean){
        super()
    }
}
class LEDToggle extends Action{
    type: actionType = "ledToggle";

    constructor(public readonly timeout: number){
        super()
    }
}

class Wait extends Action{
    type: actionType = "wait";

    constructor(public readonly msec : number){
        super()
    }
}
class SetImage extends Action{
    type: actionType = "setImage";

    constructor(){
        super()
    }
}
class ProcessImage extends Action{
    type: actionType = "processImage";

    constructor(public readonly index : number,public readonly delta : number,public readonly ymult : number){
        super()
    }
}
type CheckTimeType = "start" | "finish"
class CheckTime extends Action{
    type: actionType = "checkTime";

    constructor(public checkTimeType:CheckTimeType){
        super()
    }
}
export {MoveLength,MovePosition,LEDEnable,Wait,Action,AutoHome,SetImage,CheckTime,LEDToggle,ProcessImage};
export type { actionType,CheckTimeType }