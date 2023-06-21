const express = require('express')
const Joi = require('joi')
const router = express.Router()
const {studentModul} = require('../models/student')

const {teacherModul} = require('../models/teacher')

const bcrypt = require('bcrypt')

router.use(express.json())
router.use(express.urlencoded({ extended: false }))

router.get('', async (req, res)=>{  
     
    let body = req.body

    let {err} = validate(body)
    if(err){
        res.send({error: result.error.details[0].message}).status(400)
        return 
    }
    let user = await studentModul.findOne({login: body.login})
    let teacher = await teacherModul.findOne({login: body.login})
    if(user){
        let TrueUser = await bcrypt.compare(body.password, user.password)

        if(!TrueUser){
            res.send('Login yoki parolni xato kiritdingiz 2.').status(400)
            return
    }   
        let token =  user.generateAuthToken()
        res.header('role', user.role)
        res.header('x-user-token', token).send(user).status(200)
        return
        
    }
    if(teacher){
        let TrueUser = await bcrypt.compare(body.password, teacher.password)

        if(!TrueUser){
            res.send('Login yoki parolni xato kiritdingiz 2.').status(400)
            return
    }   
        let token =  teacher.generateAuthToken()
        res.header('role', teacher.role)
        res.header('x-user-token', token).send(teacher).status(200)
        return
        
    }

   
    res.send(`Login yoki parolni xato kiritdingiz 1.`).status(400)
        return
})

function validate(val){
    let SChemaJoi = Joi.object({
        login:Joi.string().required().min(6),
        password: Joi.string().required(),
    })
    return  SChemaJoi.validate(val);
}
module.exports = router