const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    roomName:{type:String,required:true},
    roomType:{type:String,required:true},
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service', required:true}]
})

const Room = mongoose.model('Room', roomSchema);
module.exports = Room