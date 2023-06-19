const express = require('express')
const router = express.Router()

const teacher_auth = require('../middeware/teacher')

const {TestModul, validate} = require('../models/test')

router.use(express.json())
router.use(express.urlencoded({ extended: false }))
    

router.post('/:id',teacher_auth, async (req, res) =>{

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

router.get ('/:id', teacher_auth, async (req, res )=>{
    id = parseInt(req.params.id)
    
    let testmodul = TestModul(id)
    let tests = await testmodul.find().select({question:1, keys:1, _id:0})
    res.send(tests)
})

router.put('/:id/',teacher_auth, async (req, res)=>{
    let body =  req.body
    id = parseInt(req.params.id);
    let testmodul = TestModul(id)
    let upTest = await testmodul.findOneAndUpdate(_id, 
        {
            question: body.question,
            keys: body.keys,
            trueKey: body.keys[0],

        });
        res.send(upTest);
})
router.delete('/:id',teacher_auth, async (req, res)=>{
    let body =  req.body
    id= parseInt(req.params.id);
    let testmodul = TestModul(id)    
    
    let deltest = await testmodul.findOneAndDelete({question: body.question})

     res.send("test has successfully deleted")
    

})
module.exports = {router}
