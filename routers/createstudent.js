const express = require('express')
const router = express.Router()
const {studentModul, validate} = require('../models/student')
const teacher_auth = require('../middeware/teacher')

const bcrypt = require('bcrypt')


const _ = require('lodash')

router.use(express.json())
router.use(express.urlencoded({ extended: false }))
 


router.post('',  async (req, res)=>{  
    let salt  = await bcrypt.genSalt(12)
    let student = req.body 
    student.password =  await bcrypt.hash(student.password, salt)

    student.role = 'student' 
 
    let result = validate(student)
    if(result.error){
        res.send({error: result.error.details[0].message}).status(422)
        return 
    }
    let user = await studentModul.findOne({login: student.login})
    if(user){
        res.send(`Bunday login = ${student.login} li student bor`)
        return
    }    
 

    let new_student = await studentModul.create(student)
        res.send("sucsesfully created").status(201)

})
router.get('',  async (req,res)=>{
    let students = await studentModul.find()
    res.send(students)
})
module.exports = router