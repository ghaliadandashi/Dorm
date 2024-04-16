const express = require('express');
const router = express.Router();
const multer = require('multer');
const { register, login, validate, user, logout,profile,getDorm} = require('../controllers/userController');
const upload = multer({ dest: 'uploads/' });
const authenticateToken = require('../middleware/auth')
const checkRole = require("../middleware/auth");

router.post('/register', upload.fields([
    { name: 'personalFile', maxCount: 1 },
    { name: 'ownershipFile', maxCount: 1 },
    { name: 'dormPics', maxCount: 1 }
]), register);
router.post('/login',login)
router.post('/user',user)
router.post('/logout',authenticateToken,logout)
router.get('/validate',validate)
router.get('/profile',authenticateToken,profile)
router.get('/dorm',authenticateToken,getDorm)
module.exports = router;
