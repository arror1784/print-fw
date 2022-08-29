import { getPrinterSetting } from "./json/printerSetting";
import { ResinSetting } from "./json/resin";

import requestPromise from 'request-promise'
import { getProductSetting } from "./json/productSetting";


class ResinControl{

    constructor(){
    }

    private url :string = "https://services.hix.co.kr/resin/"

    public getResinLatestupdate():Date{
        let latestUpdate = new Date(0)
        for (const i of getPrinterSetting().data.resinList) {
            
            let tmpid =  new ResinSetting(i)
            if(!tmpid.last_update)
                continue
            let tmpdate = new Date(tmpid.last_update)

            if(latestUpdate.getTime() < tmpdate.getTime())
                latestUpdate = tmpdate
        }
        return latestUpdate
    }

    /**
     * if can update return string
     * Or return null 
     * @returns string|null
     */
    public async checkAvailableToUpdateNetwork():Promise<Date|null>{

        // const request = net.request({method: 'GET',protocol: 'https:',hostname: 'services.hix.co.kr',  path: '/resin/update/C10'})
        let currentLatestUpdate = new Date(this.getResinLatestupdate())
        let serverLatestUpdate : Date|null = null

        await requestPromise({url:this.url+"update/"+getProductSetting().data.product.toUpperCase(),json:true},(error,response)=>{
            if(error){
                return
            }

            if(getPrinterSetting().data.resinList.length > Object.keys(response.body).length){
                currentLatestUpdate = new Date(0)
                for (const i of response.body) {
                    for (const name of Object.keys(i)) {
                        let temptime = new Date(i[name])

                        if(currentLatestUpdate.getTime() < temptime.getTime()){
                            currentLatestUpdate = temptime
                            serverLatestUpdate = temptime
                        }
                    }
                }
                return
            } // if resin removed
            for (const i of response.body) {
                for (const name of Object.keys(i)) {
                    let temptime = new Date(i[name])
                    console.log(currentLatestUpdate.getTime(),temptime.getTime())
                    if(currentLatestUpdate.getTime() < temptime.getTime()){
                        currentLatestUpdate = temptime
                        serverLatestUpdate = temptime
                    }
                }
            } // if resin update or add

        })
        
        return serverLatestUpdate
    }

    public async resinUpdate(){

        let rt = false

        await requestPromise({url:this.url+"download/"+getProductSetting().data.product.toUpperCase(),json:true},(error,response)=>{
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
                console.log(name)
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