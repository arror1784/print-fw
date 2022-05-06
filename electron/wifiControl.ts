interface Config{
    debug?: boolean;
    iface?: string | null;
}
interface Network{
    iface?: string,
    ssid:string;
    bssid:string;
    mac:string;
    channel:number;
    frequency:number;
    quality:number;
    security:string;
    security_flags:string;
    mode: string;
}
interface NetworkID{
    ssid: string;
    password: string;
}
interface SSID{
    ssid:string
}
interface WIFI{
    init: (conifg? :Config) => void;
    scan: (callback:(error?:Error,networks?:Network[]) => void) => void;
    connect: (id:NetworkID,callback:(error?:Error) => void) => void;
    disconnect: (callback: (error?:Error) => void) => void;
    deleteConnection: (ssid:SSID,callback:(error:Error) => void) => void;
    getCurrentConnections:(callback:(error?:Error,networks?:Network) => void) => void;
}
import * as os from 'os';
const wifi : WIFI = require('node-wifi')

export function wifiTest(){
    console.log(os.arch())
    console.log(os.networkInterfaces())
    wifi.init({
        iface: os.arch() == 'x64' ? "wlp3s0" : "wlan0" // network interface, choose a random wifi interface if set to null
      });
    wifi.scan((error, networks) => {
        if (error?.message) {
            console.log(error);
        } else {
            // console.log(networks);
        }
    });
    wifi.getCurrentConnections((error,network)=>{
        if (error) {
            console.log(error);
          } else {
            // console.log(network);
          }
    })
    // wifi.disconnect((error)=>{
    //     console.log(" ", error?.message, " try disconnnect")
    // })
    // wifi.connect({ssid:"hixResearch5G",password:"*ix20130829"},(error) => {
    //     console.log(error?.message , "try connect")
    // })
}