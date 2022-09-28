import { JsonSetting } from "./json";

interface WebSocketMessageValue{
    method: string;
    arg: any;
}


class WebSocketMessage extends JsonSetting<WebSocketMessageValue>{

    constructor(messageData:string){
        super("",{fileData:messageData})
    }

    parse(ob:any) : WebSocketMessageValue{
        return { method:ob.method,arg:ob.arg}
    }
    toJsonString(ob : WebSocketMessageValue): string{
        return JSON.stringify({
            method: ob.method,
            arg: ob.arg
        },null,2)
    }
}

export {WebSocketMessage,WebSocketMessageValue}