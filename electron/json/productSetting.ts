import { JsonSetting } from "./json";
import { existsSync } from "fs";

type ProductType = "C10" | "L10"

interface ProductSettingValue{
    product: ProductType;
}

const _productPath : string = "/opt/capsuleFw/product.json"

class ProductSetting extends JsonSetting<ProductSettingValue>{

    constructor(){
        super(_productPath,{fileData:existsSync(_productPath) ? undefined : '{"product":"C10"}',parser:ProductSetting.parser})
    }

    static parser(ob:any) : ProductSettingValue{
        if(ob.product == "L10" || ob.product == "l10")
            return {product:"C10"}
        else
            return {product:"L10"}
    }
}

const printerSettingInstance = new ProductSetting()

export function getProductSetting(){
    return printerSettingInstance
}