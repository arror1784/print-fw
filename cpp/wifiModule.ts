import binding from 'bindings';

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

    connected:boolean;

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
    onData : (cb : (type:WifiCallbackType,value:number) => void) => void;
}

const addOn : WifiModuleAddon = binding("wifiModule")
// const addOn : WifiModuleAddon = {
//     init : (path? :string) => {return true},
//     scan : () => {return true},
//     connect : (ssid :string,bssid:string,passwd?:string) => {return true},
//     disconnect : ()=> {return true},
//     getList : () => {return []},
//     deleteConnection : () => {return true},
//     getCurrentConnection : () => {return {bssid:"",flags:true,freq:0,signal_level:0,ssid:"",connected:false}},
//     onData : (cb : (type:WifiCallbackType,value:number) => void) => {},
// }
addOn.init()

export { addOn }
