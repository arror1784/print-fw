import { JsonSetting } from "./json";

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
    constructor(public readonly resinName:string,private _resinData?:string){
        super(_resinPath + resinName + '.json',{fileData:_resinData})
    }

    parse(ob : any) : ResinSettingArray{
        let rsa : ResinSettingArray = {}
        if(this.resinName == "custom" && this._resinData){
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
    save(ob : ResinSettingArray) : string{

        let jsonOb : any = {}
        Object.keys(ob).forEach((value: string,index :number) => {
            Object.defineProperty(jsonOb,value,{
                writable:true,
                value:{
                    up_accel_speed : (ob[value] as ResinSettingValue).upMoveSetting.accelSpeed,
                    up_decel_speed : ob[value].upMoveSetting.decelSpeed,

                    down_accel_speed : ob[value].downMoveSetting.accelSpeed,
                    down_decel_speed : ob[value].downMoveSetting.decelSpeed,
                    init_speed : ob[value].downMoveSetting.initSpeed,
                    max_speed : ob[value].downMoveSetting.maxSpeed,

                    layer_delay : ob[value].delay,
                    curing_time : ob[value].curingTime,
                    bed_curing_time : ob[value].bedCuringTime,
                    led_offset : ob[value].ledOffset,
                    bed_curing_layer : ob[value].bedCuringLayer,
                    z_hop_height : ob[value].zHopHeight,

                    pixelContraction : ob[value].pixelContraction,
                    ymult : ob[value].yMult
                }
            })
        })

        return JSON.stringify(jsonOb)
    }
}

export {ResinSetting}
export type {ResinSettingValue}