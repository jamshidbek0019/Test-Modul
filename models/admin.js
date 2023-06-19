const mongoose  = require('mongoose')
const Joi = require('joi')

const jwt = require('jsonwebtoken')
let adminSchema = new mongoose.Schema({
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
        enum:["admin", 'student', 'super admin']
    }
})
adminSchema.methods.generateAuthToken  =  function (){
    let token =  jwt.sign({_id: this._id,  role: this.role }, 'jwtadminPrivateKey',{
        expiresIn: '1h'
    })
    return token
}

let  adminModul = mongoose.model(`admin`, adminSchema)

function validate(val){
    let adminSchemaJoi = Joi.object({
        login:Joi.string().required(),
        password: Joi.string().required(),
        role:Joi.string().required()
    })
    return  adminSchemaJoi.validate(val);
    }
exports.adminModul = adminModul;
exports.validate =validate