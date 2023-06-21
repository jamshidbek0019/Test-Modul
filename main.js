require('express-async-errors')
const port = process.env.port || 3500;
const path = require('path')
const express = require('express')
const app = express()

const cors = require('cors')
app.use(cors())

const student = require('./routers/createstudent')
const createSubject = require('./routers/subjects')
const getTest = require('./routers/gettest')
const runtest = require('./routers/runtest')
const authUser = require('./authrouter/authorization')
const teacherRouter = require('./routers/teacher')
const admin = require('./routers/admin')
const winston =require('winston')
require('winston-mongodb')


const mongoose  = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/dbTest', {
     useNewUrlParser: true,
     useUnifiedTopology: true
})
  
app.use(express.urlencoded({extended:false}))

app.use(runtest)
app.use ('/api/student', student)
app.use('/api/subject', createSubject.router)
app.use('/api/tests', getTest.router)
app.use('/api/sign-in', authUser)
app.use('/api/teacher', teacherRouter)
app.use('/api/admin', admin)

    // app.use(function(err, req, res, next) {
    //     res.send("Serverga ulanishda hatolik").status(500)
    // });


app.listen(port,  ()=>{
    console.log("it is running on port"+port)
})