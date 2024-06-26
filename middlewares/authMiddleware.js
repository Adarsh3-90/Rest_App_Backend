const JWT = require('jsonwebtoken');
const Blacklist = require("../models/blacklist");

module.exports = async (req,res,next)=>{
    try{

        //get token
        const token = req.headers["authorization"].split(" ")[1];
        const blacklistedToken = await Blacklist.findOne({token:token});

        if(blacklistedToken){
            return res.status(400).json({
                success:false,
                message:"This session has expired,please try again "
            })
        }
        JWT.verify(token,process.env.JWT_SECRET,(err,decode)=>{
            if(err){
                return res.status(401).send({
                    success:false,
                    message:"Un-Authorize User"
                })
            }else{
                req.body.id=decode.id;
                next();
            }
        })

    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Plz Provide token",
            error
        })
    }
}