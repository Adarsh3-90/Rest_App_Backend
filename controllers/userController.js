
const bcrypt = require("bcryptjs");
const JWT = require('jsonwebtoken');

const userModel = require("../models/userModel");
const Blacklist = require("../models/blacklist");


//GET USER INFO
const getUserController = async(req,res) =>{

 try{
     
    //find user
    const user = await userModel.findById({_id:req.body.id});

    //validation
    if(!user){
        return res.status(404).send({
            success:false,
            message:"User NOt Found"
        })
    }

    //hide password
    user.password = undefined;

    //resp
    res.status(200).send({
        success:true,
        message:"User get Successfully",
        user
    });

 }catch(error){
    console.log(error);
    res.status(500).send({
        success:false,
        message:"Error in Get User API",
        error
    })
 }

};

//UPDATE USER
const updateUserController = async(req,res) =>{

try{

    //find user
    const user = await userModel.findById({_id:req.body.id})

    //validation
    if(!user){
        return res.status(404).send({
            success:false,
            message:"user not found"
        })
    }

    //update
    const {userName,address,phone,}= req.body;
    if(userName) user.userName=userName
    if(address) user.address=address
    if(phone) user.phone=phone

    //save user
    await user.save();
    res.status(200).send({
        success:true,
        message:"user Update Successfully"
    })

}catch(error){
    console.log(error);
    res.status(500).send({
        success:false,
        message:"Error in Update User API"
    })
}
}


//for resetPasswordController
const resetPasswordController = async (req, res) => {
    try {
      const { email, newPassword, answer } = req.body;
      if (!email || !newPassword || !answer) {
        return res.status(500).send({
          success: false,
          message: "Please Provide All Fields",
        });
      }
  
      const user = await userModel.findOne({ email, answer });
      if (!user) {
        return res.status(500).send({
          success: false,
          message: "User Not Found Or Invalid Answer",
        });
      }
  
      // Hashing password
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      // Update user password and save
      user.password = hashedPassword;
      await user.save();
  
      res.status(200).send({
        success: true,
        message: "Password Reset Successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in Password Reset API",
        error,
      });
    }
  };
  
  
  //Update User Password
  const updatePasswordController = async(req,res) =>{
    try{

      //find user
      const user = await userModel.findById({_id:req.body.id});

      //validation

      if(!user){
        return res.status(404).send({
          success:false,
          message:"user not found"
        })
      }

      //get data from user
      const {oldPassword,newPassword} = req.body;
      if(!oldPassword || !newPassword){
        return res.status(500).send({
          success:false,
          message:"Please Provide Old or New Password"
        })
      }

       //check user password || compare password
       const isMatch = await bcrypt.compare(oldPassword,user.password);
       if(!isMatch){
           return res.status(500).send({
               success:false,
               message:"Invalid credential"
           })
       }
     
      // Hashing password
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password=hashedPassword
      await user.save()
       res.status(200).send({
        success:true,
        message:"Password Updated"
       })

    }catch(error){
      console.log(error);
      res.status(500).send({
        success:false,
        message:"Error in password Update",
        error
      })
    }

  }

  //delete Profile Controller
  const deleteProfileController = async(req,res) =>{
    try{
      await userModel.findByIdAndDelete(req.params.id)
      return res.status(200).send({
        success:true,
        message:"Your Account Has Been Deleted"
      })

    }catch(error){
      console.log(error);
      res.status(500).send({
        success:false,
        message:"Error in Delete Profile API"
      })

    }

  }

  //logout Controller
  const logout = async(req,res)=>{
    try{

      const token = req.body.token || req.query.token || req.headers["authorization"]

      const bearer =token.split(' ');
      const bearerToken = bearer[1];

      const newBlacklist = new Blacklist({
        token:bearerToken
      })

      await newBlacklist.save();

      res.status(200).send({
        success:true,
        message:"you are Logged Out!"
      })

    }catch(error){
      console.log(error);
      res.status(500).send({
        success:false,
        message:"Error in Logout Profile API"
      })

    }
  }


module.exports = {getUserController,updateUserController,resetPasswordController,updatePasswordController,deleteProfileController,logout}