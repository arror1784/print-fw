const binding = require('bindings')
const addOn = binding("rgbTrans")

function test(){
    console.log("asdasdasdasdasdasd")
    console.log(addOn.transRgbToBase64L10("/home/jsh/0.png",5000,0))
}
test()
module.exports = addOn;