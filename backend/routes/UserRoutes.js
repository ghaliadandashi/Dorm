const express = require('express');
const router = express.Router();
const multer = require('multer');
const { register, login, validate, user, logout,profile,getDorm, changeProfilePic ,deleteProfilePic,profileEdit, getInsights, search, getUsers,
    getLogins,
    getStudentUser,
    acceptLogin,
    rejectLogin,
    getOccupancyData,
    getRevenueData,
    getExistingChats, getUserByName,
    changePassword,
    getPublicProf,
    getRoommateSuggestions
} = require('../controllers/userController');
const upload = multer({ storage: multer.memoryStorage() });
const authenticateToken = require('../middleware/auth')
const checkRole = require("../middleware/auth");
const admin = require('firebase-admin');

router.post('/register', upload.fields([
    { name: 'personalFile', maxCount: 4 },
    { name: 'ownershipFile', maxCount: 4 },
    { name: 'dormPics', maxCount: 10 }
]), register);
router.post('/login',login)
router.post('/user',user)
router.post('/logout',authenticateToken,logout)
router.get('/validate',validate)
router.get('/profile',authenticateToken,profile)
router.put('/profileEdit', authenticateToken, profileEdit);
router.post('/profile/profilePic',authenticateToken,changeProfilePic)
router.delete('/profile/profilePic',authenticateToken,deleteProfilePic)
router.get('/dorm',authenticateToken,getDorm)
router.get('/insights/:dormId',getInsights)
router.get('/search',search)
router.get('/getUsers', getUsers)
router.get('/getExistingChats', getExistingChats)
router.get('/getUserByName', getUserByName)
router.get('/getStudentUser/:sID',getStudentUser)
router.get('/getLogins',getLogins)
router.put('/acceptLogin/:userID',acceptLogin)
router.put('/rejectLogin/:userID',rejectLogin)
router.get('/occupancy/:dormId',getOccupancyData)
router.get('/revenue/:dormId',getRevenueData)
router.put('/changePassword',authenticateToken,changePassword)
router.get('/getPublicProf/:userID',authenticateToken,getPublicProf)
router.post('/roommateSuggestions',authenticateToken,getRoommateSuggestions)
module.exports = router;
