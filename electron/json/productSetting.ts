import { JsonSetting } from "./json";
import { existsSync } from "fs";

type ProductType = "C10" | "L10"

interface ProductSettingValue{
    product: ProductType;
}

const _productPath : string = process.platform === "win32" ? process.cwd() + "/temp/product.json" : "/opt/capsuleFW/product.json"

class ProductSetting extends JsonSetting<ProductSettingValue>{

    constructor(){
        super(_productPath,{fileData:existsSync(_productPath) ? undefined : '{"product":"C10"}'})
    }

    parse(ob:any) : ProductSettingValue{
        if(ob.product == "L10" || ob.product == "l10")
            return {product:"L10"}
        else
            return {product:"C10"}
    }
    toJsonString(ob: ProductSettingValue): string {
        return JSON.stringify(ob,null,2)
    }
}

const printerSettingInstance = new ProductSetting()

export function getProductSetting(){
    return printerSettingInstance
}