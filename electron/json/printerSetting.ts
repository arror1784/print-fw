import { JsonSetting } from "./json";

interface PrinterSettingValue{
    height:number;
    heightOffset:number;
    ledOffset:number;
    resinList: Array<string>;
}

const _printerSettingPath : string = "/opt/capsuleFw/capsuleSetting.json"

class PrinterSetting extends JsonSetting<PrinterSettingValue>{

    constructor(){
        super(_printerSettingPath,{parser: PrinterSetting.parser})
    }

    static parser(ob:any) : PrinterSettingValue{

        return { height: ob.default_height,
            heightOffset: ob.height_offset,
            ledOffset: ob.led_offset,
            resinList: ob.material_list as Array<string>}
    }
    static saver(ob : PrinterSettingValue): string{
        
        return JSON.stringify({
            default_height: ob.height,
            height_offset: ob.heightOffset,
            led_offset: ob.ledOffset,
            material_list: ob.resinList
        })
    }
}

const printerSettingInstance = new PrinterSetting()

export function getPrinterSetting(){
    return printerSettingInstance
}