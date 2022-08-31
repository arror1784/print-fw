

enum UpdateNotice{
    start=1,
    finish=2,
    error=3,
}

abstract class Update<T>{

    public updateCB? : (v:UpdateNotice)=>void

    abstract currentVersion() : T
    abstract serverVersion() : Promise<T | null>

    
    abstract update() : void
                updateVersion = response.body["version"]
}

export { Update,UpdateNotice }