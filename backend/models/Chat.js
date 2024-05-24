import mongoose from "mongoose";

const ChatSchema =  new mongoose.Schema({
    sender:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    receiver:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    content:[{type:String,required:'true'}],
    timestamps:[{type:Date}]
})

const Chat = mongoose.model('Chat',ChatSchema);
module.exports = Chat;