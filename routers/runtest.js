const express = require('express')
const student_auth = require('../middeware/student')
const router = express.Router()

const {resultModul} = require('../models/results')

const { TestModul, validate } = require('../models/test')

router.use(express.json())
router.use(express.urlencoded({ extended: false }))

let startTime, finishTime


router.get('/api/take-test/:id', student_auth, async (req, res) => {
    startTime = new Date()

    let id = parseInt(req.params.id)
    let testmodul = TestModul(id)

    let tests = await testmodul.find()
        .select({ question: 1, keys: 1, _id: 0 })
    tests.sort(() => {
        return Math.random() - 0.5;
    })
    tests.forEach(el => el.keys.sort(() => {
        return Math.random() - 0.5;
    }))

    let obj = {
        test: tests,
        role: req.user.role,
        name: req.user.name
    }

    res.send(obj);
})

router.post('/api/finish-test/:id', student_auth, async (req, res) => {
    finishTime = new Date()

    let answers = req.body
    let id = parseInt(req.params.id)
    let testmodul = TestModul(id)

    let results = [
        {
            question: "",
            keys: "",
            trueKeys: "",
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
            trueKey: tests_new[0].question
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

        takenTime: time,

        name: req.user.name,

        TrueAnswers: k,

        prosent: parseFloat(k) / answers.length * 100
    }

    let new_obj = await resultModul.create(obj)
    res.send(new_obj) 
     
    
})
module.exports = router