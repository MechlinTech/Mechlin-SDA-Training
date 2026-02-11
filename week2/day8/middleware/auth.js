const jwt = require('jsonwebtoken');

module.exports = (req,res,next)=>{
    try{
        const authHeader = req.headers.authorization;
        console.log("Authorization Header:", authHeader);

        if(!authHeader){
            res.status(401).json({message: 'No Token Provided'});
        }
    
        const token = authHeader.split(' ')[1];

        const decode = jwt.verify(token,process.env.JWT_SECRET || 'secret');

        req.user = decode;
        next();
    }
    catch(err){
        res.status(400).json({message:'invalid token'});
    }
};