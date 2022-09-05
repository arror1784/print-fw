import { JsonSetting } from "./json";
import fs from 'fs'
interface MoveSettings{
    accelSpeed: number;
    decelSpeed: number;
    maxSpeed: number;
    initSpeed: number;
}
interface ResinSettingValue{
    
    upMoveSetting: MoveSettings;
    downMoveSetting: MoveSettings;

    delay: number;
    curingTime: number;
    bedCuringTime: number;
    ledOffset: number;
    bedCuringLayer: number;
    zHopHeight: number;

    pixelContraction: number;
    yMult:number;

}

interface ResinSettingArray{
    [key: string]: ResinSettingValue;
    
}
const _resinPath : string = process.platform === "win32" ? process.cwd() + "/temp/resin/" : "/opt/capsuleFW/resin/"

class ResinSetting extends JsonSetting<ResinSettingArray>{

    public last_update?: string
    
    constructor(private _resinName:string,private _resinData?:string){
        super(_resinPath + _resinName + '.json',{fileData:_resinData})

        if(this._resinData !== undefined)
            this.data = this.parse(JSON.parse(this._resinData))
    }
    
    public get resinName() : string {
        return this._resinName
    }
    
    parse(ob : any) : ResinSettingArray{
        let rsa : ResinSettingArray = {}
        if(this._resinName == "custom" && this._resinData){
            let customOb = JSON.parse(this._resinData)
            rsa["custom"] = {
                upMoveSetting: {
                    accelSpeed: customOb.up_accel_speed,
                    decelSpeed: customOb.up_decel_speed,
                    initSpeed: customOb.init_speed,
                    maxSpeed: customOb.max_speed
                },
                downMoveSetting: {
                    accelSpeed: customOb.down_accel_speed,
                    decelSpeed: customOb.down_decel_speed,
                    initSpeed: customOb.init_speed,
                    maxSpeed: customOb.max_speed
                },
            
                delay: customOb.layer_delay,
                curingTime: customOb.curing_time,
                bedCuringTime: customOb.bed_curing_time,
                ledOffset: customOb.led_offset,
        
                bedCuringLayer: customOb.bed_curing_layer,
                zHopHeight: customOb.z_hop_height,
            
                pixelContraction: customOb.pixelContraction || 0,
                yMult: customOb.ymult || 1
            }
        }else{
            Object.keys(ob).forEach((value: string,index :number) => {
                if(value == "last_update"){
                    this.last_update = ob[value]
                    return
                }
                rsa[value] = {
                    upMoveSetting: {
                        accelSpeed: ob[value].up_accel_speed,
                        decelSpeed: ob[value].up_decel_speed,
                        initSpeed: ob[value].init_speed,
                        maxSpeed: ob[value].max_speed
                    },
                    downMoveSetting: {
                        accelSpeed: ob[value].down_accel_speed,
                        decelSpeed: ob[value].down_decel_speed,
                        initSpeed: ob[value].init_speed,
                        maxSpeed: ob[value].max_speed
                    },
                
                    delay: ob[value].layer_delay,
                    curingTime: ob[value].curing_time,
                    bedCuringTime: ob[value].bed_curing_time,
                    ledOffset: ob[value].led_offset,
            
                    bedCuringLayer: ob[value].bed_curing_layer,
                    zHopHeight: ob[value].z_hop_height,
                
                    pixelContraction: ob[value].pixelContraction || 0,
                    yMult: ob[value].ymult || 1
                }
            })
        }
         
        return rsa
    }
    toJsonString(ob : ResinSettingArray) : string{

        let jsonOb : any = {}
        this.last_update && Object.defineProperty(jsonOb,"last_update",{
            value: this.last_update,
            writable:true,
            enumerable:true
        })

        Object.keys(ob).forEach((key: string) => {
            Object.defineProperty(jsonOb,key,{
                writable:true,
                enumerable: true,
                value:{
                    up_accel_speed : ob[key].upMoveSetting.accelSpeed,
                    up_decel_speed : ob[key].upMoveSetting.decelSpeed,

                    down_accel_speed : ob[key].downMoveSetting.accelSpeed,
                    down_decel_speed : ob[key].downMoveSetting.decelSpeed,
                    init_speed : ob[key].downMoveSetting.initSpeed,
                    max_speed : ob[key].downMoveSetting.maxSpeed,

                    layer_delay : ob[key].delay,
                    curing_time : ob[key].curingTime,
                    bed_curing_time : ob[key].bedCuringTime,
                    led_offset : ob[key].ledOffset,
                    bed_curing_layer : ob[key].bedCuringLayer,
                    z_hop_height : ob[key].zHopHeight,

                    pixelContraction : ob[key].pixelContraction,
                    ymult : ob[key].yMult
                }
            })
        })
        return JSON.stringify(jsonOb,null,2)
    }

    deleteFile(){
        fs.rmSync(this._filePath)
    }
}

export {ResinSetting}
export type {ResinSettingValue}