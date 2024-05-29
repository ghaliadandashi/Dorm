const express = require('express');
const {addBooking,getBooking,handleStatus, deleteRequest} = require("../controllers/bookingController");
const authenticateToken = require("../middleware/auth");
const router = express.Router();

router.post('/add/:roomID/:dormID/:stay/:semester',authenticateToken,addBooking)
router.get('/getBooking',authenticateToken,getBooking)
router.put('/handleStatus/:bookingID',handleStatus)
router.delete('/deleteRequest/:bookingID',deleteRequest)
module.exports = router;