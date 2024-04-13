const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
    bookingDate: {type:Date,required:true},
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    dorm:{type:mongoose.Schema.Types.ObjectId,ref:'Dorm'},
    room:{type:mongoose.Schema.Types.ObjectId,ref:'Room'},
    startDate:{type:Date,required: true},
    endDate:{type:Date,required:true},
    status:{type:String,enum: ['Reserved','Booked']}
})

const Booking = mongoose.model('Booking',bookingSchema)
module.exports = Booking