import { parseCommand, transData, UartConnection, UartResponseType } from "../electron/uartConnection"

async function test(){

    let uartConnection : UartConnection = new UartConnection('/dev/ttyUSB0',() => {})

    uartConnection.onResponse((type : UartResponseType,response:number) => {
        console.log("type: ",type)
        console.log("respone: ", response)
    })

    uartConnection.sendCommand("G28 A255")
    await new Promise(resolve => setTimeout(resolve, 500));
}
export {test}