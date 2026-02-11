const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

const demo = {
    id:1,
    email:"admin@123.com",
    password:bcrypt.hashSync('123456',10)
};

router.post("/login",async (req,res)=>{
    const {email,password} = req.body;

    if(email !== demo.email){
        return res.status(401).json({message:"User Not Found"});
    }

    const isMatch = await bcrypt.compare(password,demo.password);

    if(!isMatch){
        return res.status(401).json({message:"Password is Wrong"});
    }

    const token = jwt.sign(
        {id: demo.id,email},
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '1h'}
    );
    res.json({token});
});

module.exports = router;