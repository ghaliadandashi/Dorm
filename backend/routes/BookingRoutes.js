const express = require('express');
const {addBooking,getBooking} = require("../controllers/bookingController");
const authenticateToken = require("../middleware/auth");
const router = express.Router();

router.post('/add/:roomID/:dormID',authenticateToken,addBooking)
router.get('/getBooking',authenticateToken,getBooking)

module.exports = router;