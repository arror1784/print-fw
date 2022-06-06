import { UartConnection, UartResponseType } from "./uartConnection"

async function test(){

    let uartConnection : UartConnection = new UartConnection('/dev/ttyUSB0',() => {})

    uartConnection.onResponse((type : UartResponseType,response:number) => {
        console.log("type: ",type)
        console.log("respone: ", response)
    })
    await uartConnection.sendCommandMoveLength(5000)
    // await uartConnection.sendCommand("G28 A255")
    console.log('finish')
    await new Promise(resolve => setTimeout(resolve, 50000));
}
export {test}