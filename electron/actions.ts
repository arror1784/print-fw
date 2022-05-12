import {UartConnection} from './uartConnection';

type actionType = "movePosition" | "MoveLength" | "ledEnable" | "wait" | "setImage";

abstract class Action{
    abstract readonly type: actionType;
}

class MovePosition extends Action{
    type: actionType = "movePosition";

    constructor(public readonly position:number){
        super()
    }
}

class MoveLength extends Action{
    type: actionType = "MoveLength";

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

class Wait extends Action{
    type: actionType = "wait";

    constructor(public readonly msec : number){
        super()
    }
}

class SetImage extends Action{
    type: actionType = "setImage";

    constructor(public readonly src : string){
        super()
    }
}
export {MoveLength,MovePosition,LEDEnable,Wait,actionType,Action};