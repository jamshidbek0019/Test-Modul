const mongoose  = require('mongoose')
const Joi = require('joi')

let testSchema= new mongoose.Schema({
    id:{
        type: Number,
        required: true,
    },
    question:{
        type: String,
        required: true,
        minlength: 6,
    },
    keys:{
        type: Array,
        required: true,
        length: 4
    },
    trueKey: String
})

function TestModul(id){
    return  mongoose.model(`tests-keys-${id}`, testSchema)
}

function validate(val){
let testSchemaJoi = Joi.object({
    question: Joi.string().required().min(8),
    keys:Joi.array().items(Joi.string().required()).length(4),
    trueKey:Joi.string(),
    id:Joi.number().integer()
})
return  testSchemaJoi.validate(val);
}

exports.TestModul = TestModul;
exports.validate = validate;
