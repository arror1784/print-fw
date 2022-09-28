import { timeStamp } from 'console';
import { send } from 'process';
import {WebSocket,RawData} from 'ws';
import { getProductSetting } from './json/productSetting';
import { WebSocketMessage } from './json/webSockectMessage';
import { PrintWorker, WorkingState } from './printWorker';

enum MessageType{
    ListMaterialName = "listMaterialName",
    Print = "print",
    PrintInfo = "printInfo",
    ChangeState = "changeState",
    GetProductName = "getProductName",
}

class WebPrintControl{
    
    private _url : string = "ws://localhost:8000/ws/printer"
    private _ws : WebSocket | undefined

    public onMessage : ((message: WebSocketMessage) => void) | undefined 

    constructor(private _printWorker:PrintWorker){
        this.connect()
    }

    connect(){
        this._ws = new WebSocket(this._url)
        this._ws.on("open",()=>{
            console.log("websocket open")
        })
        this._ws.on("close",()=>{
            this.connect()
        })
        this._ws.on("message",(data:RawData,isBinary)=>{
            let webSocketMessage = new WebSocketMessage(data.toString())

            this.onMessage && this.onMessage(webSocketMessage)
        })
    }

    changeStateToPrint(){
        this.sendMessage("changeState","print")
    }
    changeState(state:WorkingState,message?:string){
        let ob:any = {}

        ob["state"] = state
        ob["message"] = message && ""

        this.sendMessage("changeState",ob)
    }
    changeProgress(progress:number){
        this.sendMessage("updateProgress",progress)
    }
    setTotalTime(time:number){
        this.sendMessage("setTotalTime",time)
    }
    settingError(code:number,message:string){
        let ob: any = {}
        ob["code"] = code
        ob["message"] = message
        this.sendMessage("printSettingError",ob)
    }
    sendMessage(method:string,arg : any){

        let ob : any = {}
        ob["method"] = method
        ob["arg"] = arg

        this._ws?.send(JSON.stringify(ob),(err?:Error|undefined)=>{
            if(err)
                console.log("websocket send error")
        })
    }
}

export {WebPrintControl,MessageType}