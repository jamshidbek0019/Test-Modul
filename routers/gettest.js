const express = require('express')
const router = express.Router()

const teacher_auth = require('../middeware/teacher')

const {TestModul, validate} = require('../models/test')

router.use(express.json())
router.use(express.urlencoded({ extended: false }))
    

router.post('/:id', async (req, res) =>{

    let test = req.body;
    let id = parseInt(req.params.id)
    test.id= id
    test.trueKey = test.keys[0];

    let result = validate(test)
    if (result.error){
        res.send({error: result.error.details[0].message}).status(400)
        return
    }
   
    let testmodul = TestModul(id)
    await testmodul.create(test)
    res.send("test has successfully added").status(201)

})

router.get ('/:id',  async (req, res )=>{
    id = parseInt(req.params.id)
    
    let testmodul = TestModul(id)
    let data = await testmodul.find().select({question:1, keys:1, _id:0})
    let dataSend = {
        data
    }
    res.send(dataSend)
})

router.put('/:id', async (req, res)=>{
    let new_test = req.body;
    let id = parseInt(req.params.id)
    new_test.id= id
    new_test.trueKey = new_test.keys[0];
    let testmodul = TestModul(id)
   try{
    await testmodul.findOneAndUpdate({question: new_test.question},new_test)
   } catch(err){
        res.status().send(err)
        return
   }
        res.send("successfully updated");
})
router.delete('/:id', async (req, res)=>{
    let body =  req.body
    id= parseInt(req.params.id);
    let testmodul = TestModul(id)       
     await testmodul.findOneAndDelete({question: body.question})

     res.send("test has successfully deleted")
    

})
module.exports = {router}
