const express = require('express');
const router = express.Router();
const multer = require('multer');
const { add, show, dormDetails, addRoom, getRooms} = require('../controllers/dormController');
const authenticateToken = require("../middleware/auth");
const upload = multer({ dest: 'uploads/' });

router.post('/add', upload.fields([
    { name: 'dormName', maxCount: 1 }
    // not sure about the payload. will need to add other fields later.
]),authenticateToken, add);
router.post('/addRoom',authenticateToken,addRoom)
router.get('/show',show)
router.get('/rooms/getRooms/:dormID',getRooms)
router.get('/dormDetails/:dormID',dormDetails)

module.exports = router;
