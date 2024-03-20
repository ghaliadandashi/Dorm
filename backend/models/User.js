const mongoose = require('mongoose');
const {mongo} = require("mongoose");

const userSchema = new mongoose.Schema({
    name :{type:String, required:true},
    email:{type:String, required:true, unique: true},
    role:{type:String, enum: ['admin','student','dormOwner'] ,required:true},
    microsoftID:{type:String,required:false},
    password:
        {
            type:String,
            required:()=> {
                if(this.role ==='dormOwner' || this.role==='admin'){
                    return 'true';
                }
            }},
    dob:{type:Date, required:false},
    booking:{type:mongoose.Schema.Types.ObjectId,ref:'Booking'},
    preferences:{type:String}
})
const User = mongoose.model('User',userSchema)
module.exports =User