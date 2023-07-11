const express = require('express')
const student_auth = require('../middeware/student')
const router = express.Router()
const {subjectModul} = require('../models/subject')

const {resultModul} = require('../models/results')

const { TestModul, validate } = require('../models/test')

router.use(express.json())
router.use(express.urlencoded({ extended: false }))

let startTime, finishTime
 

router.get('/api/take-test/:id',  async (req, res) => {
    startTime = new Date()

    let id = parseInt(req.params.id)
    let testmodul = TestModul(id)

    let data = await testmodul.find()
        .select({ question: 1, keys: 1, _id:1    })
    data.sort(() => {
        return Math.random() - 0.5;
    })
    data.forEach(el => el.keys.sort(() => {
        return Math.random() - 0.5;
    }))
    let dataSend= {
        data
    }

    res.send(dataSend);
})

router.post('/api/finish-test/:id', student_auth, async (req, res) => {
    finishTime = new Date()

    let answers = req.body
    let id = parseInt(req.params.id)
    let themeData = await subjectModul.find({id: id})
    let testmodul = TestModul(id)

    let results = [
        {
            question: "",
            keys: "",
            trueKey: "",
            correct: true
        }]

    let tests_new = {}

    let k = 0
    for (i = 0; i < answers.length; i++) {

        let answer = answers[i].keys;
        tests_new = await testmodul.find({ question: answers[i].question })
        results[i] = {
            question: answers[i].question,
            keys: answer,
            trueKeys: tests_new[0].question
        }

        if (tests_new[0].trueKey == answer) {

            results[i] = {
                question: answers[i].question,
                keys: answer,
                trueKey: tests_new[0].trueKey,
                correct: true
            }
            k++;
        }
        else {

            results[i] = {
                question: answers[i].question,
                keys: answer,
                trueKey: tests_new[0].trueKey,
                correct: false
            }

        }

    }
    let timeS = (finishTime - startTime) / 1000
    let timeM = timeS / 60
    let time = `${parseInt(timeM)}:${parseInt(timeS % 60)}`
    let obj = {
        answer: results,
        theme: themeData[0].theme,

        takenTime: time,

        name: req.user.name,

        TrueAnswers: k,

        prosent: parseFloat(k) / answers.length * 100
    }

    let data = await resultModul.create(obj)
    res.send({
        takenTime: obj.takenTime,
        TrueAnswers:obj.TrueAnswers, 
        prosent:obj.prosent}) 
     
    
})
router.get('/api/result', async (req, res)=>{
    let data = await resultModul.find()
    .select({
        answer:0
    })
    let dataSend = {
        data
    }
    res.send(dataSend) 
})
module.exports = router