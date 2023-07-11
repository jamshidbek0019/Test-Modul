const mongoose  = require('mongoose')
const Joi = require('joi')

let subjectSchema = new mongoose.Schema({
    id:{
        type: Number,
        required: true,
        unique : true,
    },
    theme:{
        type:String,
        required:true
    },
    information:{
        type:String,
        required:true
    },
    link:{
        type:String,
    },
})

let  subjectModul = mongoose.model(`subjects`, subjectSchema)

function validate(val){
    let subjectSchemaJoi = Joi.object({
        theme: Joi.string().required().min(8),
        id:Joi.number().integer(),
        information:Joi.string(),
        link:Joi.string(),
    })
    return  subjectSchemaJoi.validate(val);
    }


exports.subjectModul = subjectModul;
exports.validate = validate;

