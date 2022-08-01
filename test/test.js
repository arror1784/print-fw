console.log(require('node-addon-api').gyp)
console.log(require('node-addon-api').include)

const binding = require('bindings')
// const addOn = binding("rgbTrans")
const addOn = binding("wifiModule")

async function test(){
    // console.log(addOn.transRgbToBase64("/home/jsh/0.png",0,1,true))
    addOn.init()
    addOn.onData((asd)=>{
        console.log(asd)
    })
    addOn.scan()

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
    await delay(500000)
}
test()
module.exports = addOn;