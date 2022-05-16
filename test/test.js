const binding = require('bindings')
const addOn = binding("rgbTrans")

function test(){
    console.log(addOn.transRgbToBase64("/home/jsh/0.png",0,1,true))
}
test()
module.exports = addOn;