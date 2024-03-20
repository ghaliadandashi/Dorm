const mongoose = require('mongoose')

const dormSchema = new mongoose.Schema({
    dormName:{type:String,required:true},
    owner:{type:mongoose.Schema.Types.ObjectId,ref:'User', required:true},
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' ,required:true},],
    rooms: [{type:mongoose.Schema.Types.ObjectId,ref:'Room'}],
    location:{type:String,required:true}
})

const Dorm = mongoose.model('Dorm', dormSchema);

module.exports = Dorm