import { SerialPort , DelimiterParser} from 'serialport';
import { PrintSettings } from './Settings';


const enum UartResponseType{
    LCD = 91,
    MOVE = 101,
    AUTOREBOOT = 111,
    SHUTDOWN = 200,
    ERROR = 100
}
interface CommandFormat{
    G? : number; //8bit
    H? : number; //8bit

    A? : Uint8Array;
    B? : Uint8Array;
    C? : Uint8Array;
    M? : Uint8Array;
    P? : Uint8Array;
}
interface ResponseData{
    bed : number;
    command : number;
    response : number;
}

function toBytesInt32 (num :number) {
    let arr = new ArrayBuffer(4); // an Int32 takes 4 bytes
    let view = new DataView(arr);
    view.setInt32(0, num, false); // byteOffset = 0; litteEndian = false
    return arr;
}

class UartConnection{

    private port : SerialPort;
    private parser : DelimiterParser;
    private rcb? : (type : UartResponseType, response : number) => void;

    constructor(public readonly serialPortPath:string, onError : () => void){
        this.port = new SerialPort({
            path: serialPortPath,
            baudRate: 115200,
            autoOpen:false
          })

        this.parser = this.port.pipe(new DelimiterParser({ delimiter: [0x03],includeDelimiter:true}))
        this.parser.on('data', (response:Buffer)=>{
            let view = new Uint8Array(response)
            let i = view.findIndex((value)=>{ return value == 0x02})
            
    
            if(i == -1)
                return;
            
            let csView = new DataView(new ArrayBuffer(1))
            csView.setUint8(0,view[i+1] + view[i+2] + view[i+3])
            let checksum = csView.getUint8(0)
    
            if(checksum != view[i+4])
                return;
    
            console.log(this.rcb)
            if(this.rcb)
                this.rcb(view[i + 2],view[i+3])
        }) // emits data after every '\n'

        this.connect()
          
        //connect serialPort
    }
    init(printSetting : PrintSettings){
        this.sendCommand(`H32 A${printSetting.upMoveSetting.accelSpeed} M1`)
        this.sendCommand(`H32 A${printSetting.downMoveSetting.accelSpeed} M0`)
        this.sendCommand(`H33 A${printSetting.upMoveSetting.decelSpeed} M1`)
        this.sendCommand(`H33 A${printSetting.downMoveSetting.decelSpeed} M0`)
        this.sendCommand(`H30 A${printSetting.upMoveSetting.maxSpeed} M1`)
        this.sendCommand(`H30 A${printSetting.downMoveSetting.maxSpeed} M0`)
        this.sendCommand(`H31 A${printSetting.upMoveSetting.initSpeed} M1`)
        this.sendCommand(`H31 A${printSetting.downMoveSetting.initSpeed} M0`)

        this.sendCommand(`H12 A${printSetting.ledOffset}`)
    }
    connect(){
        this.port.open()
    }
    disconnect(){
        this.port.close()
    }
    checkConnection(){
        return this.port.isOpen;
    }
    sendCommand(command: Uint8Array | string){

        let cmd: Uint8Array = command as Uint8Array;
        if(typeof(command) === "string"){
            cmd = transData(parseCommand(command as string))
        }
        console.log(cmd)
        this.port.write(cmd)
        // this.port.drain()
        
        //sendCommand
        return true;
    }
    onResponse(cb : (type : UartResponseType, response : number) => void){
        this.rcb = cb
    }
    deleteRespone(){
        this.rcb = undefined
    }
    async sendCommandMoveLength(length:number, onMove? : () => void | undefined){

        this.sendCommand(`G01 A${length} M${length < 0 ? 0 : 1}`)

        await new Promise(resolve => setTimeout(resolve, 5000));

        onMove && onMove()

        return true;
    }
    async sendCommandMovePosition(position:number, onMove? : () => void | undefined){

        this.sendCommand(`G02 A${position} M${length < 0 ? 0 : 1}`)
        
        onMove && onMove()

        return true;
    }
    async sendCommandAutoHome(speed:number){
        if(speed > 0)
            this.sendCommand(`G28 A${speed}`)
    }
    async sendCommandLEDEnable(enable : boolean){
        if(enable)
            this.sendCommand("H11")
        else
            this.sendCommand("H10")
    }
}

class UartConnectionTest extends UartConnection{
    
}


function parseCommand(command: string) : CommandFormat{
    let paredCommand = command.split(' ')
    let data : CommandFormat = {
    }
    paredCommand.forEach((value:string) => {
        switch (value[0]) {
            case 'G':
                data.G = parseInt(value.slice(1),10) 
                break;
            case 'H':
                data.H = parseInt(value.slice(1),10) 
                break;
            case 'A':
                data.A = new Uint8Array(toBytesInt32(parseInt(value.slice(1),10)))
                break;
            case 'B':
                data.B = new Uint8Array(toBytesInt32(parseInt(value.slice(1),10)))
                break;
            case 'C':
                data.C = new Uint8Array(toBytesInt32(parseInt(value.slice(1),10)))
                break;
            case 'M':
                data.M = new Uint8Array(toBytesInt32(parseInt(value.slice(1),10)))
                break;
            case 'P':
                data.P = new Uint8Array(toBytesInt32(parseInt(value.slice(1),10)))
                break;
        }
    })

    return data
}

function transData(command: CommandFormat) : Uint8Array{

    let buf = new Uint8Array(25)
    let checksum: number = 0
    
    buf.fill(0)

    buf[0] = 0x02;
    buf[1] = command.G || 0;
    buf[2] = command.H || 0;
    if(command.A){
        buf[3] = command.A[0];
        buf[4] = command.A[1];
        buf[5] = command.A[2];
        buf[6] = command.A[3];
    }
    if(command.B){
        buf[7] = command.B[0];
        buf[8] = command.B[1];
        buf[9] = command.B[2];
        buf[10] = command.B[3];
    }
    if(command.C){

        buf[11] = command.C[0];
        buf[12] = command.C[1];
        buf[13] = command.C[2];
        buf[14] = command.C[3];
    }
    if(command.M){

        buf[15] = command.M[0];
        buf[16] = command.M[1];
        buf[17] = command.M[2];
        buf[18] = command.M[3];
    }
    if(command.P){

        buf[19] = command.P[0];
        buf[20] = command.P[1];
        buf[21] = command.P[2];
        buf[22] = command.P[3];
    }

    for(let i = 1 ; i < 23; i++){
        checksum += buf[i];
    }
    
    buf[23] = checksum;
    buf[24] = 0x03;
    return buf
}
export { UartConnection, UartConnectionTest, transData, parseCommand};
export type {UartResponseType};