const express = require('express');
const { addReview, getReviewsByDorm,deleteReview, respondToReview, deleteResponse} = require('../controllers/reviewController');
const authenticateToken = require("../middleware/auth");
const router = express.Router();

router.post('/add', authenticateToken,addReview);
router.delete('/deleteReview/:reviewID',deleteReview)
router.get('/:dormId', getReviewsByDorm);
router.post('/respond/:reviewId',respondToReview)
router.delete('/deleteResponse/:reviewID',deleteResponse)
module.exports = router;
