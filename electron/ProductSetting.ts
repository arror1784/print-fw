
import { readFileSync, writeFileSync } from 'fs';

class ProductSetting {

    private static instance: ProductSetting
    public readonly height : number;

    public readonly resinList : Array<string>;

    public readonly version : string;

    public readonly product: string;
        
    private _heightOffset : number;
    get heightOffset() {
        return this._heightOffset
    }

    set heightOffset(height: number){
        this._heightOffset = height;
        this.save()
    }

    private _ledOffset : number;
    get ledOffset() {
        return this._ledOffset
    }

    set ledOffset(ledOffset: number){
        this._ledOffset = ledOffset;
        this.save()
    }

    private _productData
    private _settingData
    private _versionData

    private _productPath = '/opt/capsuleFW/product.json'
    private _settingPath = '/opt/capsuleFW/capsuleSetting.json'
    private _versionPath = '/opt/capsuleFW/version.json'

    private constructor(){

        const productFile : string = readFileSync('/opt/capsuleFW/product.json', 'utf-8');
        this._productData = JSON.parse(productFile)
        
        this.product = this._productData.product

        const settingFile : string = readFileSync('/opt/capsuleFW/capsuleSetting.json', 'utf-8');
        this._settingData = JSON.parse(settingFile)
        this.height = this._settingData.default_height
        this._heightOffset = this._settingData.height_offset
        this._ledOffset = this._settingData.led_offset
        this.resinList = this._settingData.material_list

        const versionFile : string = readFileSync('/opt/capsuleFW/version.json', 'utf-8');
        this._versionData = JSON.parse(versionFile)

        this.version = this._versionData.version

    }

    private save(){
        writeFileSync(this._productPath,JSON.stringify(this._productData))
        writeFileSync(this._settingPath,JSON.stringify(this._settingData))
        writeFileSync(this._versionPath,JSON.stringify(this._versionData))

    }

    public static getInstance () { return this.instance || (this.instance = new this()) }

}

export {ProductSetting}