const mongoose = require('mongoose')
const User = require('./userModel')
const Channel = require('./channelModel')


const Schema = mongoose.Schema

const messageSchema = new Schema({
    text:{
        type:String,
        required:true
    },
    sender:{
        type: Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    channel:{
        type:Schema.Types.ObjectId,
        ref:'Channel',
        required:true
    }
}, {timestamps:true})

const Message = mongoose.model('Message', messageSchema)

module.exports = Message