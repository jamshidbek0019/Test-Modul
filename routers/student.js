const express = require('express')
const router = express.Router()
const {studentModul, validate} = require('../models/student')
const teacher_auth = require('../middeware/teacher')
const student_auth = require('../middeware/student')

const bcrypt = require('bcrypt')


const _ = require('lodash')

router.use(express.json())
router.use(express.urlencoded({ extended: false }))

router.post('', teacher_auth,  async (req, res)=>{  
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
 

        await studentModul.create(student)
        res.status(201).send("sucsesfully created")

})
router.get('', teacher_auth, async (req,res)=>{
    let data = await studentModul.find()
    .select({full_name:1})
    res.status(200).send(data)
})
router.delete('',teacher_auth, async (req, res)=>{
    let body = req.body
    try{
        await studentModul.findByIdAndDelete( body._id
            )}
        catch(err){
            res.send(err)
            return
        }
 
        res.send("successfully deleted")
    
})
router.put('/password', student_auth, async(req, res)=>{
        let salt  = await bcrypt.genSalt(12)
        let user = await studentModul.findById(req.user._id);

    try{
        let truePass = await bcrypt.compare(req.body.password, user.password)
        if(truePass){
            await studentModul.findByIdAndUpdate(req.user._id, {
                password: await bcrypt.hash(req.body.new_password, salt) 
            })
        } else{
            res.status(400).send("You have to send old correct password")
            return
        }

    }
        catch(err){ 
            res.send(err)
            return
        }
 
        res.send(`successfully updated  ${user}`)
    
})
module.exports = router