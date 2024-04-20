const express = require('express');
const { getUserController, updateUserController, resetPasswordController, updatePasswordController, deleteProfileController, logout } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router();


//routes
//GET USER || GET
router.get('/getUser',authMiddleware,getUserController);

//UPDATE PROFILE
router.put('/updateUser',authMiddleware,updateUserController);

//Reset Password
router.post("/resetPassword",authMiddleware,resetPasswordController);

//password update
router.post("/updatePassword",authMiddleware,updatePasswordController);

//delete Profile 
router.delete("/deleteUser/:id",authMiddleware,deleteProfileController);

//logout
router.get("/logout",authMiddleware,logout);

module.exports = router