import { PrintSettings } from "./Settings"
import { UartConnection, UartResponseType } from "./uartConnection"

async function test(){

    let uartConnection : UartConnection = new UartConnection('/dev/ttyUSB0',() => {})

    uartConnection.onResponse((type : UartResponseType,response:number) => {
        console.log("type: ",type)
        console.log("respone: ", response)
    })
    let settings : PrintSettings = {
        upMoveSetting: {
            accelSpeed: 200,
            decelSpeed: 500,
            initSpeed: 50,
            maxSpeed: 500
        },
        downMoveSetting: {
            accelSpeed: 500,
            decelSpeed: 500,
            initSpeed: 50,
            maxSpeed: 500
        },
    
        delay: 1500,
        curingTime: 2300,
        bedCuringTime: 13000,
        ledOffset: 80,
        layerHeigth: 0.1,
        totalLayer: 100,

        bedCuringLayer: 10,
        zHopHeight: 7000,
    
        pixelContraction: 0,
        yMult: 1
    }
    uartConnection.init(settings)
    await uartConnection.sendCommandMoveLength(5000)
    // await uartConnection.sendCommand("G28 A255")
    console.log('finish')
    await new Promise(resolve => setTimeout(resolve, 50000));
}
export {test}