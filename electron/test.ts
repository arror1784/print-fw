import binding = require('bindings')
const addOn = binding("rgbTrans")

function test(){
    console.log("asdasdasdasdasdasd")
    console.log(addOn.transRgbToBase64L10("/home/jsh/0.png",500,0))
}

export {test}