const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
    bookingDate: {type:Date,required:true},
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    dorm:{type:mongoose.Schema.Types.ObjectId,ref:'Dorm'},
    room:{type:mongoose.Schema.Types.ObjectId,ref:'Room'}
})

const Booking = mongoose.model('Booking',bookingSchema)
module.exports = Booking