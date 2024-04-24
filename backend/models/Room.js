const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    roomName:{type:String,required:true},
    roomType:{type:String,required:true},
    services: [{ type: String, required:true}],
    price:{type:Number,required:true},
    availability:{type:Number,required:true}
})

const Room = mongoose.model('Room', roomSchema);
module.exports = Room