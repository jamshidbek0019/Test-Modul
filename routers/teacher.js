const express = require('express')
const router = express.Router()
const {teacherModul, validate} = require('../models/teacher')

const admin_auth = require('../middeware/admin')

const bcrypt = require('bcrypt')


const _ = require('lodash')

router.use(express.json())
router.use(express.urlencoded({ extended: false }))
 


router.post('', admin_auth, async (req, res)=>{  
    let salt  = await bcrypt.genSalt(12)
    let teacher  = req.body 
    teacher.password =  await bcrypt.hash(teacher.password, salt)
    teacher.role = "teacher"
 
    let result = validate(teacher)
    if(result.error){
        res.send({error: result.error.details[0].message}).status(422)
        return 
    }
    let user = await teacherModul.findOne({login: teacher.login})
    if(user){
        res.send(`Bunday login = ${teacher.login} li teacher bor`)
        return
    }
    let new_teacher = new teacherModul(teacher)
        await new_teacher.save()
        res.send("sucsesfully created").status(201)
    

})
router.get('',admin_auth, async (req,res)=>{
    let teachers = await teacherModul.find()
    res.send(teachers)
})
router.delete('', admin_auth, async (req, res)=> {
    let name = req.body.ful_name;
    await teacherModul.findOneAndDelete({full_name: name})
    res.status(204).send('successfully deleted')
})
module.exports = router