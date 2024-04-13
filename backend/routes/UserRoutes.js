const express = require('express');
const router = express.Router();
const multer = require('multer');
const { register, login, getUserProfile, user} = require('../controllers/userController');
const upload = multer({ dest: 'uploads/' });

router.post('/register', upload.fields([
    { name: 'personalFile', maxCount: 1 },
    { name: 'ownershipFile', maxCount: 1 },
    { name: 'dormPics', maxCount: 1 }
]), register);

router.post('/login',login)

router.post('/user',user)

module.exports = router;
