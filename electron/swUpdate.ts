import { getVersionSetting } from "./json/version"
import fs from 'fs'

import requestPromise from 'request-promise'
import { exec,spawn } from "child_process"
import { Update, UpdateNotice } from "./update"

class SWUpdate extends Update<string>{
    
    constructor(){
        super()
    }

    private url :string ="https://services.hix.co.kr/setup/"
    private downloadPath : string = "/opt/capsuleFW/download/"

    public currentVersion(): string{
        return getVersionSetting().data.version
    }

    /**
     * if can update return string or null
     * @returns string|null
     */
    public async serverVersion():Promise<string | null>{

        let updateVersion:string|null = null
        let currentVersion: string = this.currentVersion()

        await requestPromise({url:this.url+"get_file/C10/version.json",json:true},(error,response)=>{
            if(error){
                return
            }
            updateVersion = currentVersion
            
            if(response.body["version"] != currentVersion){
                updateVersion = response.body["version"]
            }

        })

        return updateVersion
    }

    public async update(){

        let rt = true
        let downloadList : string[] = []
        
        this.updateCB && this.updateCB(UpdateNotice.start)

        await requestPromise({url:this.url+"get_update_manifest/C10",json:true},async (error,response)=>{
            if(error){
                rt = false
                return
            }
            for (const i of response.body) {
                downloadList.push(i)
            }
        }) // get list to download
        for (const i of downloadList) {
            await requestPromise({url:this.url+"get_file/C10/"+i,},(error,response)=>{
                if(error)
                    rt = false
                fs.writeFileSync(this.downloadPath + i,response.body)
                console.log(i)
            })
        } // download file

        let shellName = downloadList.find((value:string)=>{return value.endsWith('sh')})
        let zipName = downloadList.find((value:string)=>{return value.endsWith('zip')})
        let versionName = downloadList.find((value:string)=>{return value.endsWith('.json')})
        let binaryName = downloadList.find((value:string)=>{return value.endsWith('.binary')})
        if(!shellName && !zipName && !versionName){
            return false
        }
        if(binaryName){
            // do stm32 binary update
        }
        
        exec("chmod +x " + this.downloadPath + "/" + shellName)
        if(process.platform === "win32" || process.arch != 'arm')
            console.log(this.downloadPath+shellName+" "+this.downloadPath+zipName+" "+this.downloadPath+versionName)
        else 
            spawn(this.downloadPath+shellName+" "+this.downloadPath+zipName+" "+this.downloadPath+versionName)
        // update 

        if(!rt)
            this.updateCB && this.updateCB(UpdateNotice.error)
        else
            this.updateCB && this.updateCB(UpdateNotice.finish)

        return rt
    }

}

export { SWUpdate }