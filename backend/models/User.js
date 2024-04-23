const mongoose = require('mongoose');
const {mongo} = require("mongoose");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const {passportJwtSecret} = require("jwks-rsa");


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
    roommate:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    preferences:[{type:String}],
    phoneNo:{type:String},
    languagePreference:{type:String, enum:['turkish','english']},
    dorm:{type:mongoose.Schema.Types.ObjectId,ref:'Dorm'},
    status:{type:String,enum:['Valid','Invalid','Pending']}
})

userSchema.pre('save', function(next) {
    const user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});
const User = mongoose.model('User',userSchema)
module.exports =User