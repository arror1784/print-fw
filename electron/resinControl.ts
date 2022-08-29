import { app, net } from "electron";
import { getPrinterSetting } from "./json/printerSetting";
import { ResinSetting } from "./json/resin";

import request from 'request'
import requestPromise from 'request-promise'
import { getProductSetting } from "./json/productSetting";


class ResinControl{

    constructor(){
    }

    private url :string = "https://services.hix.co.kr/resin/update/"
    public getResinList():string[]{
        return getPrinterSetting().data.resinList
    }

    public getResinLastupdate():string{
        let lastUpdate = new Date(0)
        for (const i of getPrinterSetting().data.resinList) {
            let tmpid =  new ResinSetting(i)
            if(!tmpid.last_update)
                continue
            let tmpdate = new Date(tmpid.last_update)

            if(lastUpdate.getTime() < tmpdate.getTime())
                lastUpdate = tmpdate
        }
        return lastUpdate.toUTCString()
    }

    public async checkAvailableToUpdateNetwork():Promise<boolean>{

        // const request = net.request({method: 'GET',protocol: 'https:',hostname: 'services.hix.co.kr',  path: '/resin/update/C10'})
        let rt = false
        let currentLastUpdate = new Date(this.getResinLastupdate())
        
        await request({url:this.url+getProductSetting().data.product.toUpperCase(),json:true},(error,response)=>{
            if(error){
                rt = false
                return
            }
            for (const i of response.body) {
                for (const name of Object.keys(i)) {
                    let temptime = new Date(i[name])

                    if(currentLastUpdate.getTime() < temptime.getTime()){
                        rt = true
                        return
                    }
                }
            }

        })
        
        return rt
    }

    public async resinUpdate(){

        let rt = false

        await requestPromise({url:"https://services.hix.co.kr/resin/download/C10",json:true},(error,response)=>{
            if(error){
                rt = false
                return
            }
            
            for (const i of getPrinterSetting().data.resinList) {
                let a = new ResinSetting(i)
                a.deleteFile()
            }
            getPrinterSetting().data.resinList = []
            getPrinterSetting().saveFile()

            for (const name of Object.keys(response.body)) {
                let a = new ResinSetting(name,JSON.stringify(response.body[name]))
                a.saveFile()
            }
            
            getPrinterSetting().data.resinList = Object.keys(response.body)

            getPrinterSetting().saveFile()
            rt = true
        })

        return rt
    }
}

export {ResinControl}