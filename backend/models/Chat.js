import mongoose from "mongoose";

const ChatSchema =  new mongoose.Schema({
    participants:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
    messages:[{type:String,required:'true'}],
    timestamps:[{type:Date}]
})

const Chat = mongoose.model('Chat',ChatSchema);
module.exports = Chat;