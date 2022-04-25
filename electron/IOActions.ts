import { inherits } from "util";
import {UartConnection} from './uartConnection';

type actionType = "movePosition" | "MoveLength" | "ledEnable" | "wait";

abstract class Action{
    abstract readonly type: actionType;
}

interface MoveSettings{
    accelSpeed: number;
    decelSpeed: number;
    maxSpeed: number;
    initSpeed: number;
}

interface PrintSettings{
    delay: number;
    curingTime: number;
    bedCuringTime: number;
    ledOffset: number;

    upMoveSetting: MoveSettings;
    downMoveSetting: MoveSettings;

}

class MovePosition extends Action{
    type: actionType = "movePosition";

    constructor(public readonly position:number){
        super()
    }
}

class MoveLength extends Action{
    type: actionType = "MoveLength";

    constructor(public readonly length:number,public asd:number){
        super()
    }
}

class LEDEnable extends Action{
    type: actionType = "ledEnable";

    constructor(public readonly enable: boolean){
        super()
    }
}

class Wait extends Action{
    type: actionType = "wait";

    constructor(public readonly msec : number){
        super()
    }
}

export {MoveLength,MovePosition,LEDEnable,Wait,PrintSettings,actionType,Action};