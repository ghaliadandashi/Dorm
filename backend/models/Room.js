const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    roomName:{type:String,required:false},
    roomType:{type:String,required:true},
    services: [{ type: String, required:true}],
    pricePerSemester:{type:Number,required:true},
    summerPrice:{type:Number,required:true},
    extraFee:{type:Number,required:false},
    availability:{type:Number,required:true},
    viewType:{type:String,required:true},
    space:{type:Number,required:true},
    roomPics:[{type:String,required:true}]
})

const Room = mongoose.model('Room', roomSchema);
module.exports = Room