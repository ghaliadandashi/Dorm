const Review = require('../models/Review');

// Add a review
exports.addReview = async (req, res) => {
    try {
        const { dorm, rating, comment } = req.body;
        const student = req.user.userId;
        const time = new Date();

        console.log('Received data:', { dorm, rating, comment, student, time });

        // Validation
        if (!dorm || !rating || !comment || !student) {
            console.error('Validation failed: Missing fields');
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (rating < 1 || rating > 5) {
            console.error('Validation failed: Invalid rating');
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        const newReview = new Review({
            dorm,
            student,
            rating,
            comment,
            timestamps: time
        });

        const savedReview = await newReview.save();
        res.status(201).json(savedReview);
    } catch (error) {
        console.error('Error saving review:', error);
        res.status(500).json({ message: 'Failed to add review', error });
    }
};

// Get reviews for a dorm
exports.getReviewsByDorm = async (req, res) => {
    try {
        const { dormId } = req.params;
        const reviews = await Review.find({ dorm: dormId }).populate('student');
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get reviews', error });
    }
};

exports.deleteReview = async(req,res) =>{
    try{
        const {reviewID} = req.params;
        const review = await Review.findByIdAndDelete(reviewID);
    }catch (error){
        res.status(500).json({ message: 'Failed to get reviews', error });
    }
}

exports.respondToReview = async (req, res) => {
    try {
        const {reviewId} = req.params;
        const {response} = req.body;

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({message: 'Review not found'});
        }

        review.response = response;
        await review.save();

        res.json({message: 'Response submitted successfully'});
    } catch (error) {
        console.error('Error responding to review:', error);
        res.status(500).send('Server error');
    }
};


exports.deleteResponse = async (req,res)=>{
    try{
        const review = await Review.findById(req.params.reviewID)
        review.response = ''
        review.save()
    }catch (error) {
        console.error('Error deleting response:', error);
        res.status(500).send('Server error');
    }
}