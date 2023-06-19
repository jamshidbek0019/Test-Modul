const mongoose  = require('mongoose')
const Joi = require('joi')
const jwt = require('jsonwebtoken')

let studentSchema = new mongoose.Schema({
    full_name:{
        type:String,
        required:true,
        minlength: 8
    },
    login:{
        type: String,
        required: true,
        unique:true,
        minlength:6
    },
    password:{
    type: String,
    required:true,
    minlength:8,
    maxlength :1024},
    
    role:{
        type: String,
        enum:['teacher', 'student', 'super admin']
    }
})
studentSchema.methods.generateAuthToken  =  function (){
    let token =  jwt.sign({_id: this._id,  name: this.full_name, role: this.role }, 'jwtPrivateKey',{
        expiresIn: '1h'
    })
    return token;
}

let  studentModul = mongoose.model(`students`, studentSchema)

function validate(val){
    let studentSchemaJoi = Joi.object({
        full_name: Joi.string().required().min(8),
        login:Joi.string().required().min(6),
        password: Joi.string().required(),
        role:Joi.string().required()
    })
    return  studentSchemaJoi.validate(val);
    }


exports.studentModul = studentModul;
exports.validate = validate;