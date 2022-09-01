import { getPrinterSetting } from "./json/printerSetting";
import { ResinSetting } from "./json/resin";

import requestPromise from 'request-promise'
import { getProductSetting } from "./json/productSetting";
import { Update, UpdateNotice } from "./update";
import AdmZip from "adm-zip";

import fs from 'fs'


class ResinControl extends Update<Date>{

    constructor(){
        super()
    }

    private url :string = "https://services.hix.co.kr/resin/"

    public currentVersion() : Date{
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
    public async serverVersion():Promise<Date|null>{

        // const request = net.request({method: 'GET',protocol: 'https:',hostname: 'services.hix.co.kr',  path: '/resin/update/C10'})
        let currentLatestUpdate = new Date(this.currentVersion())
        let serverLatestUpdate : Date|null = null

        await requestPromise({url:this.url+"update/"+getProductSetting().data.product.toUpperCase(),json:true},(error,response)=>{
            if(error){
                return
            }

            serverLatestUpdate = currentLatestUpdate

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

                    if(currentLatestUpdate.getTime() < temptime.getTime()){
                        currentLatestUpdate = temptime
                        serverLatestUpdate = temptime
                    }
                }
            } // if resin update or add
        })
        
        return serverLatestUpdate
    }
    public async fileVersion(path: string): Promise<Date | null> {
        
        if(!fs.existsSync(path))
            return null

        let zip = new AdmZip(path)
        if(!zip.test())
            return null
        
        if(!zip.getEntries().find((value:AdmZip.IZipEntry)=> value.name === "material_list.json"))
            return null
        
        let materialListBuffer = zip.readFile("material_list.json")
        if(!materialListBuffer)
            return null

        let materialList = JSON.parse(materialListBuffer.toString())

        let latestUpdate = new Date(0)
        for (const i of materialList) {
            Object.keys(i).forEach((value:string)=>{
                let tmpLatestUpdate = new Date(i[value])

                if(latestUpdate < tmpLatestUpdate)
                    latestUpdate = tmpLatestUpdate

            })
        }

        return latestUpdate
    }

    public async update(){

        let rt = false
        
        this.updateCB && this.updateCB(UpdateNotice.start)

        await requestPromise({url:this.url+"download/"+getProductSetting().data.product.toUpperCase(),json:true},(error,response)=>{
            if(error){
                rt = false
                return
            }
            this.removeResinList()

            for (const name of Object.keys(response.body)) {
                console.log(name)
                let a = new ResinSetting(name,JSON.stringify(response.body[name]))
                a.saveFile()
            }
            
            getPrinterSetting().data.resinList = Object.keys(response.body)

            getPrinterSetting().saveFile()
            rt = true
        })

        if(!rt)
            this.updateCB && this.updateCB(UpdateNotice.error)
        else
            this.updateCB && this.updateCB(UpdateNotice.finish)

        return rt
    }
    public async updateFile(path:string ) {
                
        this.updateCB && this.updateCB(UpdateNotice.start)

        if(!fs.existsSync(path)){
            this.updateCB && this.updateCB(UpdateNotice.error)
            return false
        }

        let zip = new AdmZip(path)
        if(!zip.test()){
            this.updateCB && this.updateCB(UpdateNotice.error)
            return false
        }
        
        if(!zip.getEntries().find((value:AdmZip.IZipEntry)=> value.name === "material_list.json")){
            this.updateCB && this.updateCB(UpdateNotice.error)
            return false
        }        
        let materialLatestUpdateList = JSON.parse(zip.readAsText("material_list.json"))
        let materialList :string[] = []

        this.removeResinList()

        for (const i of materialLatestUpdateList) {

            Object.keys(i).forEach((value:string)=>{

                materialList.push(value)
                let a = new ResinSetting(value,zip.readAsText(value+".json"))
                a.saveFile()

            })

        }
        getPrinterSetting().data.resinList = materialList

        getPrinterSetting().saveFile()

        this.updateCB && this.updateCB(UpdateNotice.finish)
        return true
    }
    private removeResinList(){
            
        for (const i of getPrinterSetting().data.resinList) {
            let a = new ResinSetting(i)
            a.deleteFile()
        }
        getPrinterSetting().data.resinList = []
        getPrinterSetting().saveFile()
    }
}

export {ResinControl}