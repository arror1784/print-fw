import { exec } from "child_process"


function factoryReset(){
    if(process.platform === "win32" || process.arch != 'arm')
        console.log("do Factory Reset")
    else 
        exec("bash -c \"echo rasp | sudo -S /boot/factory_reset --reset > /home/pi/out 2>&1\"")
}

export {factoryReset}