const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
    dorm: {type:mongoose.Schema.Types.ObjectId,ref:'Dorm'},
    student:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    rating:{type:Number},
    comment:{type:String,required:true},
    timestamps:[{type: Date, default: Date.now}],
    response:{type:String}
})

const Review = mongoose.model('Review',ReviewSchema);
module.exports = Review