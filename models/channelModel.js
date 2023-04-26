const mongoose = require('mongoose')
const Server = require('./serverModel')
const User = require('./userModel');
const Message = require('./messageModel')

const Schema = mongoose.Schema

const channelSchema = new Schema({
    channelId:{
        type:String,
        required:true,
        unique:true
    },
    channelType:{
        type:String, //it could be serverType, oneToOneType, or group chat
        required:true
    },
    server:{
        type:Schema.Types.ObjectId,
        ref:'Server',
        required:true
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    members:[
        {
            type:Schema.Types.ObjectId,
            ref:'User',
            required:true
        }
    ],
    messages:[{
        type:Schema.Types.ObjectId,
        ref:'Message'
    }]

} ,{timestamps:true})


const Channel = mongoose.model('Channel', channelSchema)

module.exports = Channel