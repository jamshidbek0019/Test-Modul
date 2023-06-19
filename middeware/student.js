const jwt = require('jsonwebtoken')

module.exports = function student_auth(req, res, next){
    let token = req.header('x-user-token')
    if (!token){
        res.status(401).send("Unautorization token")
    }
   
    try{ 
        let decoded = jwt.verify(token, 'jwtPrivateKey')
        req.user = decoded;

    }
    catch(err){
        return res.send('Yaroqsiz token').status(400)
    }
    next()
}
