const express = require('express');
const { testUserConroller } = require('../controllers/testController');

//router object
const router = express.Router();


//routes GET| POST | UPDATE | DELETE
router.get('/test-user',testUserConroller)


//export 
module.exports =router;