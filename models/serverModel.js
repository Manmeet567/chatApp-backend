const mongoose = require('mongoose');
const User = require('./userModel');
const Channel = require('./channelModel');

const Schema = mongoose.Schema

const serverSchema = new Schema({
    name:{
        type:String,
        required:true,
        minlength:4
    },
    description:{
        type:String,
        default:null
    },
    serverImg:{
        type:String,
        default:null
    },
    creator:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    members:[
        {
            type:Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    channels:[
        {
            type:Schema.Types.ObjectId,
            ref:'Channel'
        }
    ]
}, {timestamps:true})


//static add server method
serverSchema.statics.createServer = async function(addServerData){
    if(!addServerData.name){
        throw Error("Server name Reqiured!")
    }
    if(!addServerData.creator){
        throw Error("Something went wrong!")
    }
    // validate creator id
    if(!mongoose.Types.ObjectId.isValid(addServerData.creator)){
        throw Error("Sorry for the trouble! But something went wrong")
    }

    const server = new this(addServerData)

    // save the server to the database
    await server.save()

    return server

}


const Server = mongoose.model('Server', serverSchema)

module.exports = Server

