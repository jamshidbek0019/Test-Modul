const express = require('express')
const router = express.Router()
const {subjectModul, validate } = require('../models/subject')
const {TestModul} = require('../models/test')

const student_auth = require('../middeware/student')
const teacher_auth = require('../middeware/teacher')

router.use(express.json())
router.use(express.urlencoded({ extended: false }))

router.get('', async (req, res) => {
    let data = await subjectModul.find()
    res.status(200).send(data)
})
router.post('',  async (req, res) => {
    let subjects = await subjectModul.find()
    let body = req.body
    body.id = 1;

    while(subjects.find(e =>  e.id == body.id)){
        body.id++;
    }


    let result = validate(body)
    if (result.error) {
        res.status(400).send({ error: result.error.details[0].message })
        return
    }
    await subjectModul.create(body);

    res.status(201).send("succesfully added")

})
router.delete('/:id', teacher_auth,  async (req, res) => {
   
   try{
    let id = parseInt(req.params.id);
    await subjectModul.findOneAndDelete( {id:id})
   } catch(err){
    res.status(400).send(err)
    return
   }
   res.status(204).send("successfully deleted")


})
router.patch('/:id',  async (req, res) => {
    let id = parseInt(req.params.id);
    let body = req.body
    body.id= id;
    try{
        await subjects.findOneAndUpdate({id: id}, body)
    } catch(err){
        res.status(400).send(err)
        return
       }
    res.send("succsessfully updates").status(201)
})
router.get('/:id', async (req, res) => {
    let _id = req.params.id 
    let data = await subjectModul.find({id:id}).select('-_id')
    
    res.status(200).send(data[0])
})
module.exports = { router }

