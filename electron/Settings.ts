interface MoveSettings{
    accelSpeed: number;
    decelSpeed: number;
    maxSpeed: number;
    initSpeed: number;
}

interface PrintSettings{
    upMoveSetting: MoveSettings;
    downMoveSetting: MoveSettings;

    delay: number;
    curingTime: number;
    bedCuringTime: number;
    ledOffset: number;
    layerHeigth: number;
    totalLayer: number;
    bedCuringLayer: number;
    zHopHeight: number;

    pixelContraction: number;
    yMult:number;

}
export type {MoveSettings, PrintSettings}