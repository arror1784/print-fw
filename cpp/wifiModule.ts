import * as binding from 'bindings'

export enum WifiCallbackType{
    ListUpdate = 0,
    StateChange = 1,
    ScanFail = 2,
    AssocFail = 3,
    TryAssociate = 4
}

export interface WifiInfo{
    ssid:string;
    bssid:string;

    flags:boolean;
    freq:number;
    signal_level:number;
}


export interface WifiModuleAddon {
    init : (path? :string) => boolean;
    scan : () => boolean;
    connect : (ssid :string,bssid:string,passwd?:string) => boolean;
    disconnect : ()=> boolean;
    getList : () => Array<WifiInfo>;
    deleteConnection : () => boolean;
    getCurrentConnection : () => WifiInfo;
    onData : ((type:WifiCallbackType,value:number) => void);
}

const addOn : WifiModuleAddon = binding("wifiModule")

export { addOn }
