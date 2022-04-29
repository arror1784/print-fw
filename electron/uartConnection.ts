import { prototype } from 'events';
import { SerialPort , DelimiterParser} from 'serialport';
import { PrintSettings } from './Settings';

class UartConnection{

    private port : SerialPort;
    private parser : DelimiterParser;

    constructor(public readonly serialPortPath:string, onError : () => void){
        this.port = new SerialPort({
            path: serialPortPath,
            baudRate: 115200,
            autoOpen:false
          })

        this.parser = this.port.pipe(new DelimiterParser({ delimiter: 0x03.toString()}))
        this.parser.on('data', console.log) // emits data after every '\n'

        this.connect()

          
        //connect serialPort
    }
    init(printSetting : PrintSettings){
        this.sendCommand(`H32 A${printSetting.upMoveSetting.accelSpeed} M1`)
        this.sendCommand(`H32 A${printSetting.downMoveSetting.accelSpeed} M2`)
        this.sendCommand(`H33 A${printSetting.upMoveSetting.decelSpeed} M1`)
        this.sendCommand(`H33 A${printSetting.downMoveSetting.decelSpeed} M2`)
        this.sendCommand(`H30 A${printSetting.upMoveSetting.maxSpeed} M1`)
        this.sendCommand(`H30 A${printSetting.downMoveSetting.maxSpeed} M2`)
        this.sendCommand(`H31 A${printSetting.upMoveSetting.initSpeed} M1`)
        this.sendCommand(`H31 A${printSetting.downMoveSetting.initSpeed} M2`)

        this.sendCommand(`H12 A${printSetting.ledOffset}`)
    }
    connect(){
        this.port.open()
    }
    disconnect(){
        this.port.close()
    }
    checkConnection(){
        return true;
    }
    sendCommand(command:string){
        this.port.write(command)
        this.port.drain()
        


        //sendCommand
        return true;
    }
    async sendCommandMoveLength(command:number, onMove? : () => void | undefined){

        this.port.write(this.parsingCommand(command.toString()).toString())

        await new Promise(resolve => setTimeout(resolve, 5000));

        onMove && onMove()

        return true;
    }
    async sendCommandMovePosition(command:number, onMove? : () => void | undefined){

        this.port.write(this.parsingCommand(command.toString()).toString())

        await new Promise(resolve => setTimeout(resolve, 5000));

        onMove && onMove()

        return true;
    }
    
    parsingCommand(command: string) : Int8Array{

        var arr = new Int8Array()

        return arr
    }
}

class UartConnectionTest extends UartConnection{
    
}

export { UartConnection, UartConnectionTest};