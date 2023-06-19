const express = require('express')
const router = express.Router()
const { subjectModul, validate } = require('../models/subject')

const student_auth = require('../middeware/student')
const teacher_auth = require('../middeware/teacher')

router.use(express.json())
router.use(express.urlencoded({ extended: false }))

router.get('', async (req, res) => {
    let subjects = await subjectModul.find()
        .select({ _id: 0 })
    res.send(subjects).status(200)
})
router.post('', teacher_auth, async (req, res) => {
    let subjects = await subjectModul.find()

    let body = req.body
    body.creat_at = new Date()
    body.id = subjects.length + 1;


    let result = validate(body)
    if (result.error) {
        res.send({ error: result.error.details[0].message }).status(400)
        return
    }
    await subjectModul.create(body);

    res.send("succesful").status(201)

})
router.delete('/:id',teacher_auth,  async (req, res) => {
    let id = parseInt(req.params.id);

    let subject = await subjectModul.find({ id: id })

    if (subject.length < 1) {
        res.send(`this ${id} does not exist`).status(400)
        return
    }
    let _id = subject[0]._id
    await subjectModul.findByIdAndDelete(_id)
    res.send("succsessfully deleted").status(204)
})
router.patch('/:id', teacher_auth, async (req, res) => {
    let id = parseInt(req.params.id);

    let body = req.body

    let subject = await subjectModul.find({ id: id })

    if (subject.length < 1) {
        res.send(`this ${id} does not exist`).status(400)
        return
    }
    let _id = subject[0]._id
    let subjects = subjectModul
    await subjects.findOneAndUpdate(_id, {
        theme: body.theme,
        id: body.id
    })
    res.send("succsessfully updates").status(201)
})
module.exports = { router }

