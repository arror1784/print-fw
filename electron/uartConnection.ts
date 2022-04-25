import { SerialPort } from 'serialport';

class UartConnection{
    constructor(serialPortName:string){
        //connect serialPort
    }
    checkConnection(){
        return true;
    }
    async sendCommand(command:String){
        //sendCommand
        return true;
    }
    async sendCommandMove(command:String){
        return 
    }
}

class UartConnectionTest extends UartConnection{
    constructor(serialPortName:string){
        super(serialPortName)
    }
}

export { UartConnection, UartConnectionTest};