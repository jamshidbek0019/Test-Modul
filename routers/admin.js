const express = require('express')
const router = express.Router()
const {adminModul, validate} = require('../models/admin')

const admin_auth = require('../middeware/admin')

const bcrypt = require('bcrypt')


const _ = require('lodash')

router.use(express.json())
router.use(express.urlencoded({ extended: false }))
 


router.post('',admin_auth, async (req, res)=>{  
    let salt  = await bcrypt.genSalt(12)
    let admin  = req.body 
    admin.password =  await bcrypt.hash(admin.password, salt)
    admin.role = "super admin"
 
    let result = validate(admin)
    if(result.error){
        res.send({error: result.error.details[0].message}).status(422)
        return 
    }
    let user = await adminModul.findOne({login: admin.login})
    if(user){
        res.send(`Bunday login = ${admin.login} li admin bor`)
        return
    }
    let new_admin = new adminModul(admin)
        await new_admin.save()
        res.send("sucsesfully created").status(201)
    

})
router.get('', async (req,res)=>{
    let admins = await adminModul.find()
    res.send(admins)
})
module.exports = router