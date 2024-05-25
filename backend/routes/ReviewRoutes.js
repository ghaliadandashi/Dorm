const express = require('express');
const { addReview, getReviewsByDorm,deleteReview } = require('../controllers/reviewController');
const authenticateToken = require("../middleware/auth");
const router = express.Router();

router.post('/add', authenticateToken,addReview);
router.delete('/deleteReview/:reviewID',deleteReview)
router.get('/:dormId', getReviewsByDorm);

module.exports = router;
