const mongoose = require('mongoose')

const dormSchema = new mongoose.Schema({
    dormName:{type:String,required:true},
    owner:{type:mongoose.Schema.Types.ObjectId,ref:'User', required:true},
    services: [{ type:String,required:true},],
    rooms: [{type:mongoose.Schema.Types.ObjectId,ref:'Room'}],
    capacity:{type:Number,required:true},
    occupancy:{type:Number},
    location:{type:String,required:true},
    type:{type:String,enum:['on-campus','off-campus']},
    dormPics:[{type:String}]
})

const Dorm = mongoose.model('Dorm', dormSchema);
module.exports = Dorm