const binding = require('bindings')
const addOn = binding("rgbTrans")

function test(){
    console.log(addOn.transRgbToBase64L10("/home/jsh/0.png",0,1))
}
test()
module.exports = addOn;