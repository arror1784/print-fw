import { ProductSetting } from "../ProductSetting";

function resinList() : string[] {
    return ProductSetting.getInstance().resinList
}

export {resinList}