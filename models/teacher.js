const mongoose  = require('mongoose')
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const config = require('config')
let teacherSchema = new mongoose.Schema({
    full_name:{
        type:String,
        required:true,
        minlength: 8
    },
    login:{
        type: String,
        required: true,
        unique : true,
        minlength:6
    },
    
    password:{
    type: String,
    required:true,
    minlength:8,
    maxlength :1024},

    role:{
        type: String,
        enum:["teacher", 'student', 'super admin']
    }
})
teacherSchema.methods.generateAuthToken  =  function (){
    let token =  jwt.sign({_id: this._id,name: this.full_name,  role: this.role }, 'jwtteacherPrivateKey',{
        expiresIn: '1h'
    })
    return token
}

let  teacherModul = mongoose.model(`teachers`, teacherSchema)

function validate(val){
    let teacherSchemaJoi = Joi.object({
        full_name: Joi.string().required().min(8),
        login:Joi.string().required().min(8),
        password: Joi.string().required(),
        role:Joi.string().required()
    })
    return  teacherSchemaJoi.validate(val);
    }


exports.teacherModul = teacherModul;
exports.validate = validate;