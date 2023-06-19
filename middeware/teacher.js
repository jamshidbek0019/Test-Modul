const jwt = require('jsonwebtoken')

module.exports = function teacher_auth(req, res, next){
    let token = req.header('x-user-token')
    if (!token){
        res.status(401).send("Unautorization token")
    }
   
    try{ 
        let decoded = jwt.verify(token, 'jwtteacherPrivateKey')
        req.user = decoded;
        next();

    }
    catch(err){
        return res.status(400).send('Yaroqsiz token')
         
    }
    
}
