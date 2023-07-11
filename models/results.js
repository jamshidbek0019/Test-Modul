const mongoose  = require('mongoose')


let resultSchema = new mongoose.Schema({
 answer :
   [ {
       question:String,
       keys: String,
       trueKey: String,
       correct: Boolean 
    }
],
theme:String,

takenTime: String,

name:String,

TrueAnswers : Number,

prosent: String

})
let resultModul =   mongoose.model(`results`, resultSchema)

exports.resultModul= resultModul